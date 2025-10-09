import { Component } from '../../base';
import { HTML } from '../html';
import { TusFileSchema, TusFileSchemaDefaults } from './TusFile.schema';

/**
 * TusFile Component
 *
 * A Form.io component that implements TUS protocol for resumable file uploads.
 * Extends HTML base component and provides event-driven upload progress tracking.
 */

export const TusFileProperties = {
  type: 'tusfile',
  schema: TusFileSchemaDefaults,
  template: (ctx: any) => {
    const accept = ctx.accept ? ` accept="${ctx.accept.join(',')}"` : '';
    const multiple = ctx.multiple ? ' multiple' : '';
    const disabled = ctx.disabled ? ' disabled' : '';

    return `
      <div class="${ctx.className}" ref="${ctx.ref}">
        <label for="${ctx.inputId}" class="formio-component-label">
          ${ctx.t(ctx.label || 'File Upload')}
          ${ctx.validate?.required ? '<span class="field-required">*</span>' : ''}
        </label>
        ${ctx.description ? `<div class="formio-component-description">${ctx.t(ctx.description)}</div>` : ''}

        <div class="tusfile-upload-container">
          <input
            type="file"
            id="${ctx.inputId}"
            ref="fileInput"
            ${accept}${multiple}${disabled}
            class="formio-tusfile-input"
          />

          <div class="tusfile-progress-container" ref="progressContainer" style="display: none;">
            <div class="progress">
              <div
                class="progress-bar"
                ref="progressBar"
                role="progressbar"
                style="width: 0%"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                0%
              </div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm mt-2" ref="cancelButton">
              ${ctx.t('Cancel Upload')}
            </button>
          </div>

          <div class="tusfile-info" ref="fileInfo" style="display: none;">
            <div class="alert alert-success">
              <strong>${ctx.t('Upload Complete')}</strong>
              <div ref="fileName"></div>
              <div ref="fileSize"></div>
            </div>
          </div>

          <div class="tusfile-error" ref="errorContainer" style="display: none;">
            <div class="alert alert-danger" ref="errorMessage"></div>
          </div>
        </div>

        ${ctx.tooltip ? `<div class="formio-component-tooltip">${ctx.t(ctx.tooltip)}</div>` : ''}
      </div>
    `;
  },
};

/**
 * Base TusFile class extending HTML component
 */
export class TusFile extends HTML {
  public element: any;
  public fileInputRef: HTMLInputElement | null = null;
  public progressContainerRef: HTMLElement | null = null;
  public progressBarRef: HTMLElement | null = null;
  public fileInfoRef: HTMLElement | null = null;
  public errorContainerRef: HTMLElement | null = null;
  public cancelButtonRef: HTMLButtonElement | null = null;

  // Upload state
  private uploadInProgress: boolean = false;
  private currentUpload: any = null; // TUS Upload instance

  constructor(
    public component?: TusFileSchema,
    public options?: any,
    public data?: any,
  ) {
    super(component, options, data);
  }

  /**
   * Get rendering context with TusFile-specific properties
   */
  public renderContext(extend: any = {}): any {
    const inputName = `${this.component?.type || 'tusfile'}-${this.component?.key || 'file'}`
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '_');

    return Object.assign(
      super.renderContext(),
      {
        inputId: inputName,
        accept: this.component?.accept,
        multiple: this.component?.multiple,
        disabled: this.component?.disabled,
        validate: this.component?.validate,
      },
      extend,
    );
  }

  /**
   * Get DOM element references
   */
  public getRefs() {
    return {
      tusfile: 'single',
      fileInput: 'single',
      progressContainer: 'single',
      progressBar: 'single',
      fileInfo: 'single',
      errorContainer: 'single',
      cancelButton: 'single',
      fileName: 'single',
      fileSize: 'single',
      errorMessage: 'single',
    };
  }

  /**
   * Attach event listeners and initialize component
   */
  async attach() {
    // Load references
    this.fileInputRef = this.refs.fileInput;
    this.progressContainerRef = this.refs.progressContainer;
    this.progressBarRef = this.refs.progressBar;
    this.fileInfoRef = this.refs.fileInfo;
    this.errorContainerRef = this.refs.errorContainer;
    this.cancelButtonRef = this.refs.cancelButton;

    // Attach event listeners
    if (this.fileInputRef) {
      this.addEventListener(this.fileInputRef, 'change', this.onFileSelect.bind(this));
    }

    if (this.cancelButtonRef) {
      this.addEventListener(this.cancelButtonRef, 'click', this.onCancelUpload.bind(this));
    }

    // Restore upload state if exists
    if (this.dataValue && this.dataValue.uploadId) {
      this.showFileInfo(this.dataValue);
    }

    return this;
  }

  /**
   * Detach event listeners
   */
  detach() {
    if (this.fileInputRef) {
      this.removeEventListener(this.fileInputRef, 'change', this.onFileSelect.bind(this));
    }
    if (this.cancelButtonRef) {
      this.removeEventListener(this.cancelButtonRef, 'click', this.onCancelUpload.bind(this));
    }
    super.detach?.();
  }

  /**
   * Handle file selection
   */
  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0]; // Handle single file for now

    // Validate file size
    const maxFileSize = this.component?.maxFileSize;
    if (maxFileSize && file.size > maxFileSize) {
      this.showError(
        `File size exceeds maximum allowed size of ${this.formatFileSize(maxFileSize)}`,
      );
      return;
    }

    // Validate file type
    const acceptTypes = this.component?.accept;
    if (acceptTypes && acceptTypes.length > 0) {
      const isValidType = acceptTypes.some((type) => {
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isValidType) {
        this.showError(`File type ${file.type} is not allowed`);
        return;
      }
    }

    // Start TUS upload
    await this.startUpload(file);
  }

  /**
   * Start TUS upload process
   */
  async startUpload(file: File) {
    this.uploadInProgress = true;
    this.hideError();
    this.showProgress();

    try {
      // Emit upload start event
      this.emit('tusfile.upload.start', {
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
        component: this.component,
      });

      // Note: Actual TUS client integration would go here
      // For now, we emit events and update state that the React wrapper can handle
      const uploadData = {
        uploadId: this.generateUploadId(),
        fileUrl: '', // Will be populated by TUS server
        metadata: {
          filename: file.name,
          filetype: file.type,
          filesize: file.size,
        },
        status: 'uploading',
        uploadProgress: 0,
      };

      // Update component value
      this.updateValue(uploadData);

      // Simulate progress for demonstration
      // In real implementation, TUS client would emit progress events
      this.emit('tusfile.upload.progress', {
        uploadId: uploadData.uploadId,
        progress: 0,
        bytesUploaded: 0,
        bytesTotal: file.size,
      });
    } catch (error) {
      this.uploadInProgress = false;
      this.hideProgress();
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.showError(`Upload failed: ${errorMessage}`);

      this.emit('tusfile.upload.error', {
        error: errorMessage,
        component: this.component,
      });
    }
  }

  /**
   * Update upload progress
   */
  updateProgress(progress: number, bytesUploaded: number, bytesTotal: number) {
    if (this.progressBarRef) {
      this.progressBarRef.style.width = `${progress}%`;
      this.progressBarRef.setAttribute('aria-valuenow', String(progress));
      this.progressBarRef.textContent = `${Math.round(progress)}%`;
    }

    this.emit('tusfile.upload.progress', {
      uploadId: this.dataValue?.uploadId,
      progress,
      bytesUploaded,
      bytesTotal,
    });
  }

  /**
   * Complete upload
   */
  completeUpload(fileUrl: string) {
    this.uploadInProgress = false;
    this.hideProgress();

    const uploadData = {
      ...this.dataValue,
      fileUrl,
      status: 'complete',
      uploadProgress: 100,
    };

    this.updateValue(uploadData);
    this.showFileInfo(uploadData);

    this.emit('tusfile.upload.complete', {
      uploadId: uploadData.uploadId,
      fileUrl,
      metadata: uploadData.metadata,
    });
  }

  /**
   * Cancel current upload
   */
  onCancelUpload() {
    if (this.currentUpload) {
      // TUS client abort would go here
      this.currentUpload = null;
    }

    this.uploadInProgress = false;
    this.hideProgress();

    // Reset file input
    if (this.fileInputRef) {
      this.fileInputRef.value = '';
    }

    this.emit('tusfile.upload.cancel', {
      uploadId: this.dataValue?.uploadId,
    });
  }

  /**
   * Set component value
   */
  setValue(value: any) {
    if (value && value.uploadId) {
      this.showFileInfo(value);
    }
    return super.setValue?.(value);
  }

  /**
   * Show upload progress UI
   */
  private showProgress() {
    if (this.progressContainerRef) {
      this.progressContainerRef.style.display = 'block';
    }
    if (this.fileInfoRef) {
      this.fileInfoRef.style.display = 'none';
    }
  }

  /**
   * Hide upload progress UI
   */
  private hideProgress() {
    if (this.progressContainerRef) {
      this.progressContainerRef.style.display = 'none';
    }
  }

  /**
   * Show file information after upload
   */
  private showFileInfo(data: any) {
    if (this.fileInfoRef && data.metadata) {
      this.fileInfoRef.style.display = 'block';

      const fileNameEl = this.refs.fileName;
      const fileSizeEl = this.refs.fileSize;

      if (fileNameEl) {
        fileNameEl.textContent = `File: ${data.metadata.filename}`;
      }
      if (fileSizeEl && data.metadata.filesize) {
        fileSizeEl.textContent = `Size: ${this.formatFileSize(data.metadata.filesize)}`;
      }
    }
  }

  /**
   * Show error message
   */
  private showError(message: string) {
    if (this.errorContainerRef) {
      this.errorContainerRef.style.display = 'block';
      const errorMessageEl = this.refs.errorMessage;
      if (errorMessageEl) {
        errorMessageEl.textContent = message;
      }
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
    return `tus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Emit custom events
   */
  private emit(event: string, data: any) {
    if (this.options?.events) {
      this.options.events.emit(event, data);
    }
  }
}

/**
 * TusFile Component with decorator
 */
@Component(TusFileProperties)
export class TusFileComponent extends TusFile {}
