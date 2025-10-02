/**
 * Uppy File Upload Component for Form.io
 *
 * Provides a rich file upload experience using Uppy.js Dashboard
 */

import { Components } from '@formio/js';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import GoldenRetriever from '@uppy/golden-retriever';
import Webcam from '@uppy/webcam';
import ScreenCapture from '@uppy/screen-capture';
import ImageEditor from '@uppy/image-editor';
import Audio from '@uppy/audio';
import Url from '@uppy/url';
import { ComponentSchema, UppyConfig, UploadFile, UploadStatus } from '../../types';

// Import Uppy styles
// NOTE: Uppy CSS imports removed - consuming apps must import Uppy styles
// See documentation for required CSS imports

const FileComponent = Components.components.file;

export default class UppyFileUploadComponent extends FileComponent {
  public uppy: Uppy | null = null;
  private dashboardElement: HTMLElement | null = null;

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
        plugins: ['Webcam', 'ScreenCapture', 'ImageEditor', 'Audio', 'Url']
      },
      ...extend
    });
  }

  static get builderInfo() {
    return {
      title: 'Uppy File Upload',
      icon: 'cloud-upload-alt',
      group: 'premium',
      documentation: '/userguide/forms/premium-components#uppy-file-upload',
      weight: 101,
      schema: UppyFileUploadComponent.schema()
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
                input: true
              },
              {
                type: 'number',
                key: 'uppyOptions.height',
                label: 'Dashboard Height',
                defaultValue: 450,
                weight: 26,
                conditional: {
                  json: {
                    '===': [{ var: 'data.uppyOptions.inline' }, true]
                  }
                },
                input: true
              },
              {
                type: 'checkbox',
                key: 'uppyOptions.showProgressDetails',
                label: 'Show Progress Details',
                defaultValue: true,
                weight: 27,
                input: true
              },
              {
                type: 'checkbox',
                key: 'uppyOptions.autoProceed',
                label: 'Auto Proceed',
                defaultValue: false,
                weight: 28,
                tooltip: 'Automatically start upload after adding files',
                input: true
              },
              {
                type: 'checkbox',
                key: 'uppyOptions.allowMultipleUploadBatches',
                label: 'Allow Multiple Upload Batches',
                defaultValue: true,
                weight: 29,
                input: true
              }
            ]
          }
        ]
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
                    { label: 'Instagram', value: 'Instagram' }
                  ]
                },
                defaultValue: ['Webcam', 'ScreenCapture', 'ImageEditor', 'Audio', 'Url'],
                input: true
              }
            ]
          }
        ]
      }
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
        maxFileSize: this.parseFileSize(this.component.fileMaxSize),
        minFileSize: this.parseFileSize(this.component.fileMinSize),
        maxNumberOfFiles: this.component.multiple ? 10 : 1,
        allowedFileTypes: this.parseFilePattern(this.component.filePattern)
      },
      meta: {
        formId: this.root?.formId || '',
        submissionId: this.root?.submissionId || '',
        fieldKey: this.component.key || ''
      }
    };

    // Initialize Uppy instance
    this.uppy = new Uppy({
      id: `uppy_${this.id}`,
      debug: false,
      autoProceed: uppyConfig.autoProceed,
      allowMultipleUploadBatches: uppyConfig.allowMultipleUploadBatches,
      restrictions: uppyConfig.restrictions,
      meta: uppyConfig.meta
    });

    // Add Dashboard plugin
    this.uppy.use(Dashboard, {
      target: this.dashboardElement!,
      inline: this.component.uppyOptions?.inline !== false,
      height: this.component.uppyOptions?.height || 450,
      width: '100%',
      showProgressDetails: this.component.uppyOptions?.showProgressDetails !== false,
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
      browserBackButtonClose: true
    });

    // Add TUS plugin for resumable uploads
    this.uppy.use(Tus, {
      endpoint: this.component.url || '/files',
      chunkSize: (this.component.chunkSize || 8) * 1024 * 1024,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: this.getHeaders()
    });

    // Add Golden Retriever for recovering uploads after browser crash
    this.uppy.use(GoldenRetriever, {
      serviceWorker: false
    });

    // Add optional plugins based on configuration
    const plugins = this.component.uppyOptions?.plugins || [];

    if (plugins.includes('Webcam')) {
      this.uppy.use(Webcam, { target: Dashboard });
    }

    if (plugins.includes('ScreenCapture')) {
      this.uppy.use(ScreenCapture, { target: Dashboard });
    }

    if (plugins.includes('ImageEditor')) {
      this.uppy.use(ImageEditor, { target: Dashboard });
    }

    if (plugins.includes('Audio')) {
      this.uppy.use(Audio, { target: Dashboard });
    }

    if (plugins.includes('Url')) {
      this.uppy.use(Url, {
        target: Dashboard,
        companionUrl: this.component.companionUrl || null
      });
    }

    // Set up event handlers
    this.setupUppyEventHandlers();
  }

  private setupUppyEventHandlers() {
    if (!this.uppy) return;

    this.uppy.on('file-added', (file: any) => {
      console.log('[Uppy] File added:', file.name);
      this.emit('fileAdded', file);
    });

    this.uppy.on('upload', () => {
      console.log('[Uppy] Upload started');
      this.emit('uploadStart');
    });

    this.uppy.on('upload-progress', (file: any, progress: any) => {
      console.log('[Uppy] Upload progress:', file.name, progress);
      this.emit('uploadProgress', { file, progress });
    });

    this.uppy.on('upload-success', (file: any, response: any) => {
      console.log('[Uppy] Upload success:', file.name, response);

      const uploadFile: UploadFile = {
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: response.uploadURL,
        storage: this.component.storage,
        status: UploadStatus.COMPLETED,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to component value
      const currentValue = this.getValue() || [];
      if (this.component.multiple) {
        this.setValue([...currentValue, uploadFile]);
      } else {
        this.setValue(uploadFile);
      }

      this.emit('uploadSuccess', uploadFile);
    });

    this.uppy.on('upload-error', (file: any, error: any, response: any) => {
      console.error('[Uppy] Upload error:', file.name, error);
      this.emit('uploadError', { file, error, response });
    });

    this.uppy.on('complete', (result: any) => {
      console.log('[Uppy] All uploads complete:', result);
      this.emit('uploadComplete', result);
    });

    this.uppy.on('error', (error: any) => {
      console.error('[Uppy] Error:', error);
      this.emit('error', error);
    });

    this.uppy.on('cancel-all', () => {
      console.log('[Uppy] All uploads cancelled');
      this.emit('uploadCancelled');
    });
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.root?.token || ''}`,
      'x-jwt-token': this.root?.token || ''
    };
  }

  private parseFileSize(size: string): number | null {
    if (!size) return null;

    const units: Record<string, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    };

    const match = size.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
    if (!match) return null;

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    return value * (units[unit] || 1);
  }

  private parseFilePattern(pattern: string): string[] | null {
    if (!pattern || pattern === '*') return null;

    return pattern.split(',').map(p => {
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
      this.uppy.close();
      this.uppy = null;
    }
    return super.detach();
  }

  destroy() {
    if (this.uppy) {
      this.uppy.close();
      this.uppy = null;
    }
    super.destroy();
  }
}