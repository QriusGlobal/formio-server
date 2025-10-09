import { Component } from '../../base';
import { HTML } from '../html';
import { UppyFileSchema, UppyFileSchemaDefaults, isUppyFileComponent } from './UppyFile.schema';
import * as fs from 'fs';
import * as path from 'path';

/**
 * UppyFile Component
 *
 * A Form.io component that implements modern file uploads using Uppy.
 * Supports multiple upload sources, image editing, resumable uploads via TUS,
 * and comprehensive plugin ecosystem.
 *
 * Features:
 * - Drag & drop file upload
 * - Multiple file sources (local, webcam, Google Drive, URL)
 * - Image editing capabilities
 * - Resumable uploads via TUS protocol
 * - Progress tracking and retry logic
 * - Plugin-based architecture
 * - Responsive and accessible UI
 */

/**
 * UppyFile Component Properties for decorator
 */
export const UppyFileProperties = {
  type: 'uppyfile',
  schema: UppyFileSchemaDefaults,
  template: (ctx: any) => {
    // Load EJS template
    const templatePath = path.join(__dirname, 'UppyFile.template.ejs');
    let template: string;

    try {
      template = fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      // Fallback inline template if file not found
      template = `
        <div class="<%= ctx.className %>" ref="<%= ctx.ref %>">
          <% if (ctx.component.label) { %>
            <label class="formio-component-label">
              <%= ctx.t(ctx.component.label) %>
              <% if (ctx.component.validate?.required) { %>
                <span class="field-required">*</span>
              <% } %>
            </label>
          <% } %>
          <div class="uppy-dashboard-container" ref="uppyDashboard"></div>
          <div class="uppy-error-container" ref="errorContainer" style="display: none;"></div>
          <input type="hidden" name="<%= ctx.component.key %>" ref="hiddenInput" />
        </div>
      `;
    }

    // Simple EJS template rendering
    return new Function(
      'ctx',
      `
      with(ctx) {
        let output = '';
        ${template
          .replace(/<%=/g, "'; output += String(")
          .replace(/<%/g, "'; ")
          .replace(/%>/g, "; output += '")}
        return output;
      }
    `,
    )(ctx);
  },
};

/**
 * Base UppyFile class extending HTML component
 */
export class UppyFile extends HTML {
  // DOM References
  public uppyDashboardRef: HTMLElement | null = null;
  public statusDisplayRef: HTMLElement | null = null;
  public statusMessageRef: HTMLElement | null = null;
  public statusProgressRef: HTMLElement | null = null;
  public progressBarRef: HTMLElement | null = null;
  public uploadedFilesListRef: HTMLElement | null = null;
  public fileListRef: HTMLElement | null = null;
  public errorContainerRef: HTMLElement | null = null;
  public errorMessageRef: HTMLElement | null = null;
  public errorDismissRef: HTMLElement | null = null;
  public hiddenInputRef: HTMLInputElement | null = null;
  public tooltipRef: HTMLElement | null = null;

  // Uppy instance (initialized by React wrapper or other integrations)
  public uppyInstance: any = null;

  // Upload state
  private uploadedFiles: Map<string, any> = new Map();
  private totalProgress: number = 0;
  private isUploading: boolean = false;

  constructor(
    public component: UppyFileSchema,
    public options?: any,
    public data?: any,
  ) {
    super(component, options, data);
    this.component = { ...UppyFileSchemaDefaults, ...component };
  }

  /**
   * Get rendering context with UppyFile-specific properties
   */
  public renderContext(extend: any = {}): any {
    const inputName = `${this.component.type}-${this.component.key}`
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '_');

    return Object.assign(
      super.renderContext(),
      {
        inputId: inputName,
        component: this.component,
        dataValue: this.dataValue,
      },
      extend,
    );
  }

  /**
   * Get DOM element references
   */
  public getRefs() {
    return {
      uppyfile: 'single',
      uppyDashboard: 'single',
      statusDisplay: 'single',
      statusMessage: 'single',
      statusProgress: 'single',
      progressBar: 'single',
      uploadedFilesList: 'single',
      fileList: 'single',
      errorContainer: 'single',
      errorMessage: 'single',
      errorDismiss: 'single',
      hiddenInput: 'single',
      tooltip: 'single',
      tooltipContent: 'single',
    };
  }

  /**
   * Attach event listeners and initialize component
   */
  async attach() {
    // Load DOM references
    this.uppyDashboardRef = this.refs.uppyDashboard;
    this.statusDisplayRef = this.refs.statusDisplay;
    this.statusMessageRef = this.refs.statusMessage;
    this.statusProgressRef = this.refs.statusProgress;
    this.progressBarRef = this.refs.progressBar;
    this.uploadedFilesListRef = this.refs.uploadedFilesList;
    this.fileListRef = this.refs.fileList;
    this.errorContainerRef = this.refs.errorContainer;
    this.errorMessageRef = this.refs.errorMessage;
    this.errorDismissRef = this.refs.errorDismiss;
    this.hiddenInputRef = this.refs.hiddenInput;
    this.tooltipRef = this.refs.tooltip;

    // Setup error dismiss handler
    if (this.errorDismissRef) {
      this.addEventListener(this.errorDismissRef, 'click', this.hideError.bind(this));
    }

    // Restore previous upload state if exists
    if (this.dataValue && this.dataValue.uploadedFiles) {
      this.restoreUploadedFiles(this.dataValue.uploadedFiles);
    }

    // Emit ready event for external initialization (e.g., React wrapper)
    this.emit('uppyfile.ready', {
      component: this.component,
      dashboardElement: this.uppyDashboardRef,
    });

    return this;
  }

  /**
   * Detach event listeners
   */
  detach() {
    if (this.errorDismissRef) {
      this.removeEventListener(this.errorDismissRef, 'click', this.hideError.bind(this));
    }

    // Cleanup Uppy instance if exists
    if (this.uppyInstance) {
      try {
        this.uppyInstance.close();
      } catch (error) {
        console.warn('Error closing Uppy instance:', error);
      }
      this.uppyInstance = null;
    }

    super.detach?.();
  }

  /**
   * Initialize Uppy instance (called by external integrations)
   * This method is exposed for React/Angular wrappers to inject Uppy
   */
  public initializeUppy(uppyInstance: any) {
    this.uppyInstance = uppyInstance;

    // Attach Uppy event listeners
    this.attachUppyListeners();

    return this;
  }

  /**
   * Attach event listeners to Uppy instance
   */
  private attachUppyListeners() {
    if (!this.uppyInstance) return;

    // File added event
    this.uppyInstance.on('file-added', (file: any) => {
      this.hideError();
      this.emit('uppyfile.file-added', { file, component: this.component });
      this.callEventHandler('fileAdded', file);
    });

    // Files added (batch)
    this.uppyInstance.on('files-added', (files: any[]) => {
      this.emit('uppyfile.files-added', { files, component: this.component });
      this.callEventHandler('filesAdded', files);
    });

    // File removed
    this.uppyInstance.on('file-removed', (file: any) => {
      this.uploadedFiles.delete(file.id);
      this.updateFilesList();
      this.emit('uppyfile.file-removed', { file, component: this.component });
      this.callEventHandler('fileRemoved', file);
    });

    // Upload start
    this.uppyInstance.on('upload', (data: any) => {
      this.isUploading = true;
      this.showProgress();
      this.emit('uppyfile.upload-start', { data, component: this.component });
      this.callEventHandler('uploadStart', data);
    });

    // Upload progress
    this.uppyInstance.on('progress', (progress: number) => {
      this.totalProgress = progress;
      this.updateProgress(progress);
      this.emit('uppyfile.upload-progress', { progress, component: this.component });
      this.callEventHandler('uploadProgress', progress);
    });

    // Upload success (individual file)
    this.uppyInstance.on('upload-success', (file: any, response: any) => {
      this.uploadedFiles.set(file.id, {
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: response.uploadURL || response.url,
        uploadURL: response.uploadURL,
        preview: file.preview,
        meta: file.meta,
      });

      this.updateFilesList();
      this.emit('uppyfile.upload-success', { file, response, component: this.component });
      this.callEventHandler('uploadSuccess', { file, response });
    });

    // Upload complete (all files)
    this.uppyInstance.on('complete', (result: any) => {
      this.isUploading = false;
      this.hideProgress();
      this.updateComponentValue();
      this.emit('uppyfile.upload-complete', { result, component: this.component });
      this.callEventHandler('uploadComplete', result);
    });

    // Upload error
    this.uppyInstance.on('upload-error', (file: any, error: any, response: any) => {
      this.showError(`Upload failed for ${file.name}: ${error.message || 'Unknown error'}`);
      this.emit('uppyfile.upload-error', { file, error, response, component: this.component });
      this.callEventHandler('uploadError', { file, error, response });
    });

    // Upload retry
    this.uppyInstance.on('upload-retry', (fileID: string) => {
      this.emit('uppyfile.upload-retry', { fileID, component: this.component });
      this.callEventHandler('uploadRetry', fileID);
    });

    // Restriction failed
    this.uppyInstance.on('restriction-failed', (file: any, error: any) => {
      this.showError(`File restriction: ${error.message}`);
      this.emit('uppyfile.restriction-failed', { file, error, component: this.component });
    });

    // Error (general)
    this.uppyInstance.on('error', (error: any) => {
      this.showError(error.message || 'An error occurred');
      this.emit('uppyfile.error', { error, component: this.component });
      this.callEventHandler('error', error);
    });

    // Info
    this.uppyInstance.on('info-visible', () => {
      this.emit('uppyfile.info-visible', { component: this.component });
      this.callEventHandler('info', {});
    });

    // Cancel all uploads
    this.uppyInstance.on('cancel-all', () => {
      this.isUploading = false;
      this.hideProgress();
      this.emit('uppyfile.cancel-all', { component: this.component });
      this.callEventHandler('cancel', {});
    });
  }

  /**
   * Call custom event handler if configured
   */
  private callEventHandler(eventName: string, data: any) {
    const handlerName = this.component.events?.[eventName as keyof typeof this.component.events];
    if (handlerName && typeof window !== 'undefined') {
      try {
        const handler = (window as any)[handlerName];
        if (typeof handler === 'function') {
          handler.call(this, data, this.component);
        }
      } catch (error) {
        console.error(`Error calling event handler ${handlerName}:`, error);
      }
    }
  }

  /**
   * Update component value with uploaded files data
   */
  private updateComponentValue() {
    const uploadedFilesArray = Array.from(this.uploadedFiles.values());

    const value = {
      uploadId: this.generateUploadId(),
      fileUrls: uploadedFilesArray.map((f) => f.url || f.uploadURL).filter(Boolean),
      uploadedFiles: uploadedFilesArray,
      metadata: {
        totalFiles: uploadedFilesArray.length,
        totalSize: uploadedFilesArray.reduce((sum, f) => sum + f.size, 0),
        uploadedAt: new Date().toISOString(),
      },
    };

    this.updateValue(value);

    // Update hidden input
    if (this.hiddenInputRef) {
      this.hiddenInputRef.value = JSON.stringify(value);
    }
  }

  /**
   * Set component value
   */
  setValue(value: any) {
    if (value && value.uploadedFiles) {
      this.restoreUploadedFiles(value.uploadedFiles);
    }
    return super.setValue?.(value);
  }

  /**
   * Restore uploaded files from saved data
   */
  private restoreUploadedFiles(files: any[]) {
    this.uploadedFiles.clear();
    files.forEach((file) => {
      this.uploadedFiles.set(file.id, file);
    });
    this.updateFilesList();
  }

  /**
   * Update uploaded files list display
   */
  private updateFilesList() {
    if (!this.fileListRef || !this.uploadedFilesListRef) return;

    if (this.uploadedFiles.size === 0) {
      this.uploadedFilesListRef.style.display = 'none';
      return;
    }

    this.uploadedFilesListRef.style.display = 'block';
    this.fileListRef.innerHTML = '';

    this.uploadedFiles.forEach((file) => {
      const listItem = this.createFileListItem(file);
      this.fileListRef!.appendChild(listItem);
    });
  }

  /**
   * Create file list item element
   */
  private createFileListItem(file: any): HTMLElement {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.dataset.fileId = file.id;

    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    fileInfo.innerHTML = `
      <i class="fa fa-file mr-2 file-icon"></i>
      <span class="file-name">${this.escapeHtml(file.name)}</span>
      <small class="text-muted file-size ml-2">${this.formatFileSize(file.size)}</small>
    `;

    const fileActions = document.createElement('div');
    fileActions.className = 'file-actions';

    if (file.url || file.uploadURL) {
      const downloadLink = document.createElement('a');
      downloadLink.href = file.url || file.uploadURL;
      downloadLink.className = 'btn btn-sm btn-outline-primary file-download';
      downloadLink.target = '_blank';
      downloadLink.title = 'Download';
      downloadLink.innerHTML = '<i class="fa fa-download"></i>';
      fileActions.appendChild(downloadLink);
    }

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn btn-sm btn-outline-danger file-remove ml-1';
    removeButton.title = 'Remove';
    removeButton.innerHTML = '<i class="fa fa-trash"></i>';
    removeButton.onclick = () => this.removeFile(file.id);
    fileActions.appendChild(removeButton);

    li.appendChild(fileInfo);
    li.appendChild(fileActions);

    return li;
  }

  /**
   * Remove file from uploaded files
   */
  private removeFile(fileId: string) {
    this.uploadedFiles.delete(fileId);
    this.updateFilesList();
    this.updateComponentValue();

    // Remove from Uppy if exists
    if (this.uppyInstance) {
      try {
        this.uppyInstance.removeFile(fileId);
      } catch (error) {
        // File might not exist in Uppy anymore
      }
    }
  }

  /**
   * Show upload progress
   */
  private showProgress() {
    if (this.statusDisplayRef) {
      this.statusDisplayRef.style.display = 'block';
    }
    if (this.statusMessageRef) {
      this.statusMessageRef.textContent = 'Uploading files...';
    }
  }

  /**
   * Hide upload progress
   */
  private hideProgress() {
    if (this.statusDisplayRef) {
      this.statusDisplayRef.style.display = 'none';
    }
  }

  /**
   * Update progress bar
   */
  private updateProgress(progress: number) {
    if (this.progressBarRef) {
      const percentage = Math.round(progress);
      this.progressBarRef.style.width = `${percentage}%`;
      this.progressBarRef.setAttribute('aria-valuenow', String(percentage));
      this.progressBarRef.textContent = `${percentage}%`;
    }
  }

  /**
   * Show error message
   */
  private showError(message: string) {
    if (this.errorContainerRef && this.errorMessageRef) {
      this.errorContainerRef.style.display = 'block';
      this.errorMessageRef.textContent = message;
    }
  }

  /**
   * Hide error message
   */
  private hideError() {
    if (this.errorContainerRef) {
      this.errorContainerRef.style.display = 'none';
    }
  }

  /**
   * Generate unique upload ID
   */
  private generateUploadId(): string {
    return `uppy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Emit custom events
   */
  private emit(event: string, data: any) {
    if (this.options?.events) {
      this.options.events.emit(event, data);
    }

    // Also emit as DOM custom event
    if (this.element) {
      const customEvent = new CustomEvent(event, { detail: data, bubbles: true });
      this.element.dispatchEvent(customEvent);
    }
  }

  /**
   * Get Uppy instance (for external access)
   */
  public getUppyInstance() {
    return this.uppyInstance;
  }

  /**
   * Get uploaded files data
   */
  public getUploadedFiles() {
    return Array.from(this.uploadedFiles.values());
  }

  /**
   * Clear all uploaded files
   */
  public clearFiles() {
    this.uploadedFiles.clear();
    this.updateFilesList();
    this.updateComponentValue();

    if (this.uppyInstance) {
      this.uppyInstance.cancelAll();
    }
  }
}

/**
 * UppyFile Component with decorator
 */
@Component(UppyFileProperties)
export class UppyFileComponent extends UppyFile {}
