/**
 * File Storage Provider for Form.io
 *
 * Abstract provider interface for different storage backends
 */

import { StorageProvider, UploadFile } from '../types';

export default class FileStorageProvider implements StorageProvider {
  name = 'file';
  title = 'File Storage Provider';

  private config: any;

  constructor(config: any = {}) {
    this.config = {
      endpoint: '/files',
      ...config
    };
  }

  async uploadFile(file: File, options: any = {}): Promise<UploadFile> {
    // This is the base implementation that would be overridden
    // by specific storage providers (GCS, S3, Azure, etc.)

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('size', file.size.toString());
    formData.append('type', file.type);

    // Add metadata
    if (options.metadata) {
      Object.keys(options.metadata).forEach(key => {
        formData.append(`metadata[${key}]`, options.metadata[key]);
      });
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'x-jwt-token': options.token || ''
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      id: result.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: result.url,
      storage: 'file',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    } as UploadFile;
  }

  async downloadFile(file: UploadFile): Promise<Blob> {
    const response = await fetch(file.url!);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async deleteFile(file: UploadFile): Promise<void> {
    const response = await fetch(`${this.config.endpoint}/${file.id}`, {
      method: 'DELETE',
      headers: {
        'x-jwt-token': this.config.token || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  }

  async getFileUrl(file: UploadFile): Promise<string> {
    // Generate signed URL if needed
    if (file.url) {
      return file.url;
    }

    const response = await fetch(`${this.config.endpoint}/${file.id}/url`, {
      headers: {
        'x-jwt-token': this.config.token || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get file URL: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url;
  }

  // Static factory method for Form.io provider registration
  static register(Formio: any) {
    Formio.Providers.addProvider('storage', 'file', FileStorageProvider);
  }
}