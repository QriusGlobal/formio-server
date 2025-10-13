/**
 * Multi-Image Upload Component for Form.io
 *
 * Adapter that bridges the pure React MultiImageUpload component to Form.io.
 * Follows Anti-Corruption Layer pattern to minimize coupling.
 */

import { Components } from '@formio/js';
import { logger } from '../../utils/logger';
import { UPLOAD_CONSTANTS } from '../../config/constants';

const FileComponent = (Components as any).components.file;

export default class MultiImageUploadComponent extends FileComponent {
  private reactContainer: HTMLElement | null = null;
  private mountedReactComponent: any = null;
  private static reactComponentFactory: any = null;

  static get type() {
    return 'multiimageupload';
  }

  static registerReactComponent(factory: any) {
    MultiImageUploadComponent.reactComponentFactory = factory;
  }

  static schema(...extend: any[]) {
    return FileComponent.schema(
      {
        type: 'multiimageupload',
        label: 'Multi-Image Upload',
        key: 'site_images',
        storage: 'url',
        url: UPLOAD_CONSTANTS.DEFAULT_TUS_ENDPOINT,
        maxFiles: UPLOAD_CONSTANTS.DEFAULT_MAX_FILES,
        compressionQuality: UPLOAD_CONSTANTS.DEFAULT_COMPRESSION_QUALITY,
        autoNumbering: true,
        extractMetadata: true,
        filePattern: 'image/*,video/*',
        fileMaxSize: '10MB',
      },
      ...extend
    );
  }

  static get builderInfo() {
    return {
      title: 'Multi-Image Upload',
      icon: 'images',
      group: 'premium',
      documentation: '/userguide/forms/premium-components#multi-image-upload',
      weight: 102,
      schema: MultiImageUploadComponent.schema(),
    };
  }

  static editForm() {
    return FileComponent.editForm();
  }

  render() {
    this.reactContainer = this.ce('div', {
      class: 'formio-component-multiimageupload',
      id: `${this.component.key}-react-container`,
    });

    this.loadReactComponent();

    return this.reactContainer;
  }

  async loadReactComponent() {
    if (!this.reactContainer) return;

    try {
      if (!MultiImageUploadComponent.reactComponentFactory) {
        throw new Error('React component factory not registered');
      }

      const { React, ReactDOM, MultiImageUpload } =
        MultiImageUploadComponent.reactComponentFactory();

      const root = ReactDOM.createRoot(this.reactContainer);

      root.render(
        React.createElement(MultiImageUpload, {
          formKey: this.component.key || 'site_images',
          maxFiles: this.component.maxFiles || UPLOAD_CONSTANTS.DEFAULT_MAX_FILES,
          compressionQuality:
            this.component.compressionQuality || UPLOAD_CONSTANTS.DEFAULT_COMPRESSION_QUALITY,
          autoNumbering: this.component.autoNumbering ?? true,
          extractMetadata: this.component.extractMetadata ?? true,
          onChange: (files: any) => {
            this.updateValue(files);
          },
          value: this.dataValue || [],
        })
      );

      this.mountedReactComponent = root;
    } catch (error) {
      logger.error('Failed to load React component', {
        componentKey: this.component?.key,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      if (this.reactContainer) {
        this.reactContainer.innerHTML = `
          <div class="alert alert-danger">
            Failed to load Multi-Image Upload component. Please check console for details.
          </div>
        `;
      }
    }
  }

  destroy() {
    if (this.mountedReactComponent) {
      try {
        this.mountedReactComponent.unmount();
      } catch (error) {
        logger.warn('Error unmounting React component', {
          componentKey: this.component?.key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      this.mountedReactComponent = null;
    }
    this.reactContainer = null;
    super.destroy();
  }

  getValue() {
    return this.dataValue || [];
  }

  setValue(value: any) {
    this.dataValue = value;
    return true;
  }
}
