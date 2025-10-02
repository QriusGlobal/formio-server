/**
 * TUS File Upload Component for Form.io
 *
 * Extends Form.io's base File component to provide TUS resumable upload capabilities
 */

import { Components } from '@formio/js';
import * as tus from 'tus-js-client';
import { ComponentSchema, TusConfig, UploadFile, UploadStatus } from '../../types';

const FileComponent = Components.components.file;

export default class TusFileUploadComponent extends FileComponent {
  public tusUpload: any;
  public currentFile: UploadFile | null = null;
  private uploadQueue: File[] = [];
  private isUploading = false;

  static schema(...extend: any[]): ComponentSchema {
    return FileComponent.schema({
      type: 'tusupload',
      label: 'TUS File Upload',
      key: 'tusupload',
      storage: 'tus',
      url: '',
      options: {
        uploadOnly: false,
      },
      filePattern: '*',
      fileMinSize: '0KB',
      fileMaxSize: '1GB',
      uploadOnly: false,
      ...extend
    });
  }

  static get builderInfo() {
    return {
      title: 'TUS File Upload',
      icon: 'cloud-upload',
      group: 'premium',
      documentation: '/userguide/forms/premium-components#file-upload',
      weight: 100,
      schema: TusFileUploadComponent.schema()
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
                type: 'textfield',
                key: 'tusEndpoint',
                label: 'TUS Upload Endpoint',
                placeholder: 'https://example.com/files',
                weight: 25,
                tooltip: 'The TUS server endpoint for resumable uploads',
                input: true
              },
              {
                type: 'number',
                key: 'chunkSize',
                label: 'Chunk Size (MB)',
                defaultValue: 8,
                weight: 26,
                tooltip: 'Size of each upload chunk in megabytes',
                input: true
              },
              {
                type: 'checkbox',
                key: 'resumable',
                label: 'Enable Resumable Uploads',
                defaultValue: true,
                weight: 27,
                tooltip: 'Allow uploads to resume after connection loss',
                input: true
              }
            ]
          }
        ]
      },
      {
        key: 'validation',
        components: [
          {
            key: 'validationBasic',
            components: [
              {
                type: 'textfield',
                key: 'filePattern',
                label: 'File Pattern',
                placeholder: '*.pdf,*.doc,*.docx',
                weight: 10,
                tooltip: 'Allowed file extensions',
                input: true
              },
              {
                type: 'textfield',
                key: 'fileMinSize',
                label: 'Minimum File Size',
                placeholder: '1KB',
                weight: 11,
                tooltip: 'Minimum allowed file size',
                input: true
              },
              {
                type: 'textfield',
                key: 'fileMaxSize',
                label: 'Maximum File Size',
                placeholder: '10MB',
                weight: 12,
                tooltip: 'Maximum allowed file size',
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
    this.component.storage = 'tus';
    this.component.url = this.component.tusEndpoint || this.component.url || '/files';
  }

  init() {
    super.init();
    this.initializeTusClient();
  }

  private initializeTusClient() {
    const config: TusConfig = {
      endpoint: this.component.url || '/files',
      chunkSize: (this.component.chunkSize || 8) * 1024 * 1024,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      parallelUploads: 3,
      headers: this.getHeaders(),
      metadata: this.getMetadata()
    };

    // Will be initialized per upload
    this.tusUpload = null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'x-jwt-token': this.root?.token || ''
    };

    // Add custom headers if provided
    if (this.component.headers) {
      Object.assign(headers, this.component.headers);
    }

    return headers;
  }

  private getMetadata(): Record<string, string> {
    return {
      filename: '',
      filetype: '',
      formId: this.root?.formId || '',
      submissionId: this.root?.submissionId || '',
      fieldKey: this.component.key || ''
    };
  }

  attach(element: HTMLElement) {
    this.loadRefs(element, {
      fileDrop: 'single',
      fileBrowse: 'single',
      galleryButton: 'single',
      cameraButton: 'single',
      fileUpload: 'single',
      hiddenFileInputElement: 'single',
      fileList: 'single',
      camera: 'single',
      canvas: 'single',
      fileStatusUploading: 'multiple',
      fileImage: 'multiple',
      fileError: 'multiple',
      fileLink: 'multiple',
      removeLink: 'multiple',
      fileStatusRemove: 'multiple',
      fileSize: 'multiple',
      fileUploadingStatus: 'multiple',
      fileProcessingStatus: 'multiple',
      fileProgress: 'multiple',
      fileProgressInner: 'multiple'
    });

    const superAttach = super.attach(element);

    if (this.refs.fileBrowse) {
      this.addEventListener(this.refs.fileBrowse, 'click', (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        if (this.refs.hiddenFileInputElement) {
          this.refs.hiddenFileInputElement.click();
        }
      });
    }

    return superAttach;
  }

  async upload(files: File[]): Promise<any[]> {
    this.uploadQueue = files;
    const results = [];

    for (const file of files) {
      this.isUploading = true;

      try {
        const result = await this.uploadFile(file);
        results.push(result);
        this.emit('fileUploadComplete', result);
      } catch (error) {
        console.error('[TUS] Upload error:', error);
        this.emit('fileUploadError', error);
        results.push({ error });
      }
    }

    this.isUploading = false;
    return results;
  }

  private uploadFile(file: File): Promise<UploadFile> {
    return new Promise((resolve, reject) => {
      const uploadFile: UploadFile = {
        id: this.generateFileId(),
        name: file.name,
        size: file.size,
        type: file.type,
        storage: 'tus',
        status: UploadStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const upload = new tus.Upload(file, {
        endpoint: this.component.url || '/files',
        chunkSize: (this.component.chunkSize || 8) * 1024 * 1024,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: this.getHeaders(),
        metadata: {
          ...this.getMetadata(),
          filename: file.name,
          filetype: file.type || 'application/octet-stream'
        },
        onError: (error: Error) => {
          console.error('[TUS] Upload failed:', error);
          uploadFile.status = UploadStatus.FAILED;
          uploadFile.error = {
            code: 'UPLOAD_ERROR',
            message: error.message
          };
          reject(uploadFile);
        },
        onProgress: (bytesUploaded: number, bytesTotal: number) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          uploadFile.progress = parseFloat(percentage);
          uploadFile.status = UploadStatus.UPLOADING;
          this.updateProgress(uploadFile);
        },
        onSuccess: () => {
          uploadFile.status = UploadStatus.COMPLETED;
          uploadFile.url = upload.url;
          uploadFile.uploadId = upload.url?.split('/').pop();

          // Create Form.io compatible file data
          const fileData = {
            name: uploadFile.name,
            size: uploadFile.size,
            type: uploadFile.type,
            url: uploadFile.url,
            storage: 'tus',
            originalName: file.name,
            uploadId: uploadFile.uploadId
          };

          // Update Form.io component value (handle single vs multiple files)
          if (this.component.multiple) {
            const currentValue = this.dataValue || [];
            this.dataValue = Array.isArray(currentValue) ? [...currentValue, fileData] : [fileData];
          } else {
            this.dataValue = fileData;
          }

          // Trigger Form.io updates to propagate value to form submission
          this.updateValue();
          this.triggerChange();

          this.updateProgress(uploadFile);
          resolve(uploadFile);
        }
      });

      // Store reference for pause/resume
      this.tusUpload = upload;
      this.currentFile = uploadFile;

      // Start upload
      upload.start();
      this.emit('fileUploadStart', uploadFile);
    });
  }

  private updateProgress(file: UploadFile) {
    if (this.refs.fileProgress && this.refs.fileProgress.length > 0) {
      const progressBar = this.refs.fileProgress[0] as HTMLElement;
      if (progressBar) {
        progressBar.style.width = `${file.progress || 0}%`;
      }
    }

    this.emit('fileUploadProgress', {
      file,
      progress: file.progress || 0
    });
  }

  pauseUpload() {
    if (this.tusUpload) {
      this.tusUpload.abort();
      this.emit('fileUploadPaused', this.currentFile);
    }
  }

  resumeUpload() {
    if (this.tusUpload) {
      this.tusUpload.start();
      this.emit('fileUploadResumed', this.currentFile);
    }
  }

  cancelUpload() {
    if (this.tusUpload) {
      this.tusUpload.abort();
      this.tusUpload = null;
      this.currentFile = null;
      this.emit('fileUploadCancelled');
    }
  }

  private generateFileId(): string {
    return `tus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getValue(): any {
    return this.dataValue;
  }

  setValue(value: any, flags: any = {}) {
    const changed = super.setValue(value, flags);
    if (changed) {
      this.redraw();
      this.triggerChange();
    }
    return changed;
  }

  getValueAsString(value: any): string {
    if (Array.isArray(value)) {
      return value.map(val => val.name || val.url || '').join(', ');
    }
    return value?.name || value?.url || '';
  }

  getView(value: any): string {
    if (!value) return '';

    if (Array.isArray(value)) {
      return value.map(file =>
        `<a href="${file.url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`
      ).join('<br>');
    }

    return `<a href="${value.url}" target="_blank" rel="noopener noreferrer">${value.name}</a>`;
  }
}