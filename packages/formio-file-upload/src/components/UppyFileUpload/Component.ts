/**
 * Uppy File Upload Component for Form.io
 *
 * Provides a rich file upload experience using Uppy.js Dashboard
 */

import { Components } from '@formio/js';
import Audio from '@uppy/audio';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import GoldenRetriever from '@uppy/golden-retriever';
import ImageEditor from '@uppy/image-editor';
import ScreenCapture from '@uppy/screen-capture';
import Tus from '@uppy/tus';
import Url from '@uppy/url';
import Webcam from '@uppy/webcam';

import { type ComponentSchema, type UppyConfig, type UploadFile, UploadStatus } from '../../types';
import { logger } from '../../utils/logger';
import { verifyFileType, sanitizeFilename } from '../../validators';

// Import Uppy styles
// NOTE: Uppy CSS imports removed - consuming apps must import Uppy styles
// See documentation for required CSS imports

const FileComponent = Components.components.file;

export default class UppyFileUploadComponent extends FileComponent {
  public uppy: Uppy | null = null;
  private dashboardElement: HTMLElement | null = null;

  private handleFileAdded?: (file: any) => Promise<void>;
  private handleUpload?: () => void;
  private handleUploadProgress?: (file: any, progress: any) => void;
  private handleUploadSuccess?: (file: any, response: any) => void;
  private handleUploadError?: (file: any, error: any) => void;
  private handleComplete?: (result: any) => void;
  private handleError?: (error: any) => void;
  private handleCancelAll?: () => void;

  static schema(...extend: any[]): ComponentSchema {
    return FileComponent.schema({
      type: 'uppyupload',
      label: 'Uppy File Upload',
      key: 'uppyupload',
      storage: 'url',
      url: '',
      options: {
        uploadOnly: false,
      },
      filePattern: '*',
      fileMinSize: '0KB',
      fileMaxSize: '1GB',
      uppyOptions: {
        inline: true,
        height: 450,
        showProgressDetails: true,
        showLinkToFileUploadResult: true,
        proudlyDisplayPoweredByUppy: false,
        plugins: ['Webcam', 'ScreenCapture', 'ImageEditor', 'Audio', 'Url'],
      },
      ...extend,
    });
  }

  static get builderInfo() {
    return {
      title: 'Uppy File Upload',
      icon: 'cloud-upload-alt',
      group: 'premium',
      documentation: '/userguide/forms/premium-components#uppy-file-upload',
      weight: 101,
      schema: UppyFileUploadComponent.schema(),
    };
  }

  static editForm() {
    return FileComponent.editForm([
      {
        key: 'display',
        components: [
          {
            key: 'displayBasic',
            components: [
              {
                type: 'checkbox',
                key: 'uppyOptions.inline',
                label: 'Inline Dashboard',
                defaultValue: true,
                weight: 25,
                tooltip: 'Show dashboard inline vs modal',
                input: true,
              },
              {
                type: 'number',
                key: 'uppyOptions.height',
                label: 'Dashboard Height',
                defaultValue: 450,
                weight: 26,
                conditional: {
                  json: {
                    '===': [{ var: 'data.uppyOptions.inline' }, true],
                  },
                },
                input: true,
              },
              {
                type: 'checkbox',
                key: 'uppyOptions.showProgressDetails',
                label: 'Show Progress Details',
                defaultValue: true,
                weight: 27,
                input: true,
              },
              {
                type: 'checkbox',
                key: 'uppyOptions.autoProceed',
                label: 'Auto Proceed',
                defaultValue: false,
                weight: 28,
                tooltip: 'Automatically start upload after adding files',
                input: true,
              },
              {
                type: 'checkbox',
                key: 'uppyOptions.allowMultipleUploadBatches',
                label: 'Allow Multiple Upload Batches',
                defaultValue: true,
                weight: 29,
                input: true,
              },
            ],
          },
        ],
      },
      {
        key: 'data',
        components: [
          {
            key: 'dataBasic',
            components: [
              {
                type: 'select',
                key: 'uppyOptions.plugins',
                label: 'Enabled Plugins',
                multiple: true,
                weight: 30,
                data: {
                  values: [
                    { label: 'Webcam', value: 'Webcam' },
                    { label: 'Screen Capture', value: 'ScreenCapture' },
                    { label: 'Image Editor', value: 'ImageEditor' },
                    { label: 'Audio Recording', value: 'Audio' },
                    { label: 'Import from URL', value: 'Url' },
                    { label: 'Google Drive', value: 'GoogleDrive' },
                    { label: 'Dropbox', value: 'Dropbox' },
                    { label: 'Instagram', value: 'Instagram' },
                  ],
                },
                defaultValue: ['Webcam', 'ScreenCapture', 'ImageEditor', 'Audio', 'Url'],
                input: true,
              },
            ],
          },
        ],
      },
    ]);
  }

  constructor(component: any, options: any, data: any) {
    super(component, options, data);
    this.component.storage = this.component.storage || 'url';
  }

  init() {
    super.init();
  }

  attach(element: HTMLElement) {
    const superAttach = super.attach(element);

    // Create container for Uppy Dashboard
    this.dashboardElement = document.createElement('div');
    this.dashboardElement.className = 'uppy-dashboard-container';

    // Find or create upload area
    const uploadArea = element.querySelector('.formio-component-file') || element;
    uploadArea.appendChild(this.dashboardElement);

    // Initialize Uppy
    this.initializeUppy();

    return superAttach;
  }

  private initializeUppy() {
    const uppyConfig: UppyConfig = {
      autoProceed: this.component.uppyOptions?.autoProceed || false,
      allowMultipleUploadBatches: this.component.uppyOptions?.allowMultipleUploadBatches !== false,
      restrictions: {
        maxFileSize: this.parseFileSize(this.component.fileMaxSize) ?? undefined,
        minFileSize: this.parseFileSize(this.component.fileMinSize) ?? undefined,
        maxNumberOfFiles: this.component.multiple ? 10 : 1,
        allowedFileTypes: this.parseFilePattern(this.component.filePattern) ?? undefined,
      },
      meta: {
        formId: this.root?.formId || '',
        submissionId: this.root?.submissionId || '',
        fieldKey: this.component.key || '',
      },
    };

    // Initialize Uppy instance
    this.uppy = new Uppy({
      id: `uppy_${this.id}`,
      debug: false,
      autoProceed: uppyConfig.autoProceed,
      allowMultipleUploadBatches: uppyConfig.allowMultipleUploadBatches,
      restrictions: uppyConfig.restrictions,
      meta: uppyConfig.meta,
    });

    // Add Dashboard plugin
    this.uppy.use(Dashboard, {
      target: this.dashboardElement!,
      inline: this.component.uppyOptions?.inline !== false,
      height: this.component.uppyOptions?.height || 450,
      width: '100%',
      hideProgressDetails: this.component.uppyOptions?.showProgressDetails === false,
      showLinkToFileUploadResult: this.component.uppyOptions?.showLinkToFileUploadResult !== false,
      proudlyDisplayPoweredByUppy: false,
      hideUploadButton: uppyConfig.autoProceed,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      hideProgressAfterFinish: false,
      doneButtonHandler: null,
      note: this.component.description || null,
      closeModalOnClickOutside: true,
      closeAfterFinish: false,
      disableThumbnailGenerator: false,
      disablePageScrollWhenModalOpen: true,
      animateOpenClose: true,
      browserBackButtonClose: true,
    });

    // Add TUS plugin for resumable uploads
    this.uppy.use(Tus, {
      endpoint: this.component.url || '/files',
      chunkSize: (this.component.chunkSize || 8) * 1024 * 1024,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: this.getHeaders(),
    });

    // Add Golden Retriever for recovering uploads after browser crash
    this.uppy.use(GoldenRetriever, {
      serviceWorker: false,
    });

    // Add optional plugins based on configuration
    const plugins = this.component.uppyOptions?.plugins || [];

    if (plugins.includes('Webcam')) {
      (this.uppy as any).use(Webcam, { target: Dashboard });
    }

    if (plugins.includes('ScreenCapture')) {
      (this.uppy as any).use(ScreenCapture, { target: Dashboard });
    }

    if (plugins.includes('ImageEditor')) {
      (this.uppy as any).use(ImageEditor, { target: Dashboard });
    }

    if (plugins.includes('Audio')) {
      (this.uppy as any).use(Audio, { target: Dashboard });
    }

    if (plugins.includes('Url')) {
      (this.uppy as any).use(Url, {
        target: Dashboard,
        companionUrl: this.component.companionUrl || null,
      });
    }

    // Set up event handlers
    this.setupUppyEventHandlers();
  }

  private setupUppyEventHandlers() {
    if (!this.uppy) return;

    this.handleFileAdded = async (file: any) => {
      // Security: Sanitize filename
      const safeName = sanitizeFilename(file.name, {
        addTimestamp: true,
        preserveExtension: false,
      });

      // Security: Verify file type
      const isValidType = await verifyFileType(file.data, file.type);
      if (!isValidType) {
        logger.error('[Uppy Security] File type verification failed:', file.name);
        this.uppy?.info(
          `Security: File "${file.name}" content does not match declared type`,
          'error',
          5000
        );
        this.uppy?.removeFile(file.id);
        return;
      }

      // Update file with sanitized name
      this.uppy?.setFileMeta(file.id, {
        name: safeName,
        originalName: file.name,
      });

      this.emit('fileAdded', file);
    };

    this.handleUpload = () => {
      this.emit('uploadStart');
    };

    this.handleUploadProgress = (file: any, progress: any) => {
      this.emit('uploadProgress', { file, progress });
    };

    this.handleUploadSuccess = (file: any, response: any) => {
      const uploadFile: UploadFile = {
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: response.uploadURL,
        storage: this.component.storage,
        status: UploadStatus.COMPLETED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to component value
      const currentValue = this.getValue() || [];
      if (this.component.multiple) {
        this.setValue([...currentValue, uploadFile]);
      } else {
        this.setValue(uploadFile);
      }

      this.emit('uploadSuccess', uploadFile);
    };

    this.handleUploadError = (file: any, error: any) => {
      logger.error('[Uppy] Upload error:', { fileName: file?.name, error });
      this.emit('uploadError', { file, error });
    };

    this.handleComplete = (result: any) => {
      // P3-T2: Clean up GoldenRetriever localStorage to prevent QuotaExceededError (critical for Safari 5MB limit)
      if (result.successful.length > 0 && result.failed.length === 0) {
        const uppyId = this.uppy!.getID();
        try {
          localStorage.removeItem(`uppy/${uppyId}`);
        } catch (error) {
          logger.warn('[Uppy] Failed to clean recovery state:', { error });
        }
      }

      this.emit('uploadComplete', result);
    };

    this.handleError = (error: any) => {
      logger.error('[Uppy] Error:', { error });
      this.emit('error', error);
    };

    this.handleCancelAll = () => {
      this.emit('uploadCancelled');
    };

    this.uppy.on('file-added', this.handleFileAdded);
    this.uppy.on('upload', this.handleUpload);
    this.uppy.on('upload-progress', this.handleUploadProgress);
    this.uppy.on('upload-success', this.handleUploadSuccess);
    this.uppy.on('upload-error', this.handleUploadError);
    this.uppy.on('complete', this.handleComplete);
    this.uppy.on('error', this.handleError);
    this.uppy.on('cancel-all', this.handleCancelAll);
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.root?.token || ''}`,
      'x-jwt-token': this.root?.token || '',
    };
  }

  private parseFileSize(size: string): number | null {
    if (!size) return null;

    const units: Record<string, number> = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    const match = size.match(/^(\d+(?:\.\d+)?)\s*([gkmt]?b)$/i);
    if (!match) return null;

    const value = Number.parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    return value * (units[unit] || 1);
  }

  private parseFilePattern(pattern: string): string[] | null {
    if (!pattern || pattern === '*') return null;

    return pattern.split(',').map((p) => {
      const trimmed = p.trim();
      if (trimmed.startsWith('*.')) {
        return `.${trimmed.substring(2)}`;
      }
      return trimmed;
    });
  }

  getValue(): any {
    return this.dataValue;
  }

  setValue(value: any) {
    this.dataValue = value;
  }

  detach() {
    if (this.uppy) {
      // P1-T2: Remove all event listeners to prevent memory leaks
      if (this.handleFileAdded) this.uppy.off('file-added', this.handleFileAdded);
      if (this.handleUpload) this.uppy.off('upload', this.handleUpload);
      if (this.handleUploadProgress) this.uppy.off('upload-progress', this.handleUploadProgress);
      if (this.handleUploadSuccess) this.uppy.off('upload-success', this.handleUploadSuccess);
      if (this.handleUploadError) this.uppy.off('upload-error', this.handleUploadError);
      if (this.handleComplete) this.uppy.off('complete', this.handleComplete);
      if (this.handleError) this.uppy.off('error', this.handleError);
      if (this.handleCancelAll) this.uppy.off('cancel-all', this.handleCancelAll);

      this.uppy.cancelAll(); // Cancel all uploads (close() removed in Uppy v3+)
      this.uppy = null;
    }
    return super.detach();
  }

  destroy() {
    if (this.uppy) {
      // P1-T2: Remove all event listeners to prevent memory leaks
      if (this.handleFileAdded) this.uppy.off('file-added', this.handleFileAdded);
      if (this.handleUpload) this.uppy.off('upload', this.handleUpload);
      if (this.handleUploadProgress) this.uppy.off('upload-progress', this.handleUploadProgress);
      if (this.handleUploadSuccess) this.uppy.off('upload-success', this.handleUploadSuccess);
      if (this.handleUploadError) this.uppy.off('upload-error', this.handleUploadError);
      if (this.handleComplete) this.uppy.off('complete', this.handleComplete);
      if (this.handleError) this.uppy.off('error', this.handleError);
      if (this.handleCancelAll) this.uppy.off('cancel-all', this.handleCancelAll);

      this.uppy.cancelAll(); // Cancel all uploads (close() removed in Uppy v3+)
      this.uppy = null;
    }
    super.destroy();
  }
}
