/**
 * Multi-Image Upload Component for Form.io
 *
 * Adapter that bridges the pure React MultiImageUpload component to Form.io.
 * Follows Anti-Corruption Layer pattern to minimize coupling.
 */

import { Components } from '@formio/js';

import { UPLOAD_CONSTANTS } from '../../config/constants';
import { WHITELABEL_CONFIG } from '../../config/whitelabel';
import { logger } from '../../utils/logger';

const FileComponent = (Components as any).components.file;

export default class MultiImageUploadComponent extends FileComponent {
  private reactContainer: HTMLElement | null = null;
  private mountedReactComponent: any = null;
  private static reactComponentFactory: any = null;

  constructor(component: any, options: any, data: any) {
    console.log('🔴 [MultiImageUpload] constructor() START', {
      timestamp: new Date().toISOString(),
      componentKey: component?.key,
      componentType: component?.type,
      hasOptions: !!options,
      hasData: !!data,
    });

    super(component, options, data);

    console.log('🔴 [MultiImageUpload] constructor() COMPLETE', {
      timestamp: new Date().toISOString(),
      componentKey: this.component?.key,
      reactContainer: this.reactContainer,
      mountedReactComponent: this.mountedReactComponent,
    });

    logger.info('MultiImageUploadComponent constructor called', {
      componentKey: component?.key,
      componentType: component?.type,
    });
  }

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

  attach(element: HTMLElement) {
    console.log('🔴 [MultiImageUpload] attach() START', {
      timestamp: new Date().toISOString(),
      componentKey: this.component?.key,
      elementReceived: element,
    });

    const superResult = super.attach(element);

    console.log(
      '🔴 [MultiImageUpload] attach() super.attach() complete, creating React container',
      {
        timestamp: new Date().toISOString(),
      }
    );

    this.reactContainer = document.createElement('div');
    this.reactContainer.className = WHITELABEL_CONFIG.CLASSES.UPLOAD_WIDGET;
    this.reactContainer.id = WHITELABEL_CONFIG.ID_PATTERNS.UPLOAD_CONTAINER(this.component.key);

    const uploadArea = element.querySelector(WHITELABEL_CONFIG.SELECTORS.UPLOAD_AREA) || element;
    uploadArea.appendChild(this.reactContainer);

    console.log('🔴 [MultiImageUpload] attach() React container appended to DOM', {
      timestamp: new Date().toISOString(),
      containerInDocument: document.contains(this.reactContainer),
      containerParent: this.reactContainer.parentNode,
    });

    this.loadReactComponent();

    console.log('🔴 [MultiImageUpload] attach() COMPLETE', {
      timestamp: new Date().toISOString(),
    });

    return superResult;
  }

  detach() {
    console.log('🔴 [MultiImageUpload] detach() START', {
      timestamp: new Date().toISOString(),
      componentKey: this.component?.key,
      hasMountedReactComponent: !!this.mountedReactComponent,
      hasReactContainer: !!this.reactContainer,
      containerInDocument: this.reactContainer ? document.contains(this.reactContainer) : false,
    });

    // Properly unmount React component before detaching
    if (this.mountedReactComponent) {
      console.log('🔴 [MultiImageUpload] detach() unmounting React component', {
        timestamp: new Date().toISOString(),
        mountedComponent: this.mountedReactComponent,
      });

      try {
        this.mountedReactComponent.unmount();
        console.log('🔴 [MultiImageUpload] detach() React component unmounted successfully', {
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('🔴 [MultiImageUpload] detach() error unmounting React component', {
          timestamp: new Date().toISOString(),
          error,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });

        logger.warn('Error unmounting React component during detach', {
          componentKey: this.component?.key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      this.mountedReactComponent = null;
    } else {
      console.log('🔴 [MultiImageUpload] detach() no mounted React component to unmount', {
        timestamp: new Date().toISOString(),
      });
    }

    console.log('🔴 [MultiImageUpload] detach() clearing reactContainer reference', {
      timestamp: new Date().toISOString(),
    });

    this.reactContainer = null;

    console.log('🔴 [MultiImageUpload] detach() COMPLETE', {
      timestamp: new Date().toISOString(),
      cleanupComplete: true,
    });
  }

  async loadReactComponent() {
    console.log('🔴 [MultiImageUpload] loadReactComponent() START', {
      timestamp: new Date().toISOString(),
      componentKey: this.component?.key,
      hasReactContainer: !!this.reactContainer,
      reactContainer: this.reactContainer,
    });

    if (!this.reactContainer) {
      console.error('🔴 [MultiImageUpload] loadReactComponent() ABORTED - reactContainer is null', {
        timestamp: new Date().toISOString(),
        componentKey: this.component?.key,
        thisObject: this,
      });
      logger.error('loadReactComponent called but reactContainer is null', {
        componentKey: this.component?.key,
      });
      return;
    }

    console.log('🔴 [MultiImageUpload] loadReactComponent() checking DOM state', {
      timestamp: new Date().toISOString(),
      containerInDocument: document.contains(this.reactContainer),
      containerParent: this.reactContainer.parentNode,
      containerParentTagName: this.reactContainer.parentNode
        ? (this.reactContainer.parentNode as HTMLElement).tagName
        : null,
      documentBodyContains: document.body.contains(this.reactContainer),
    });

    console.log('🔴 [MultiImageUpload] loadReactComponent() checking factory', {
      timestamp: new Date().toISOString(),
      hasFactory: !!MultiImageUploadComponent.reactComponentFactory,
      factoryType: typeof MultiImageUploadComponent.reactComponentFactory,
      factory: MultiImageUploadComponent.reactComponentFactory,
    });

    logger.info('loadReactComponent called', {
      componentKey: this.component?.key,
      hasFactory: !!MultiImageUploadComponent.reactComponentFactory,
      containerInDocument: document.contains(this.reactContainer),
    });

    try {
      if (!MultiImageUploadComponent.reactComponentFactory) {
        console.error(
          '🔴 [MultiImageUpload] loadReactComponent() ABORTED - factory not registered',
          {
            timestamp: new Date().toISOString(),
          }
        );
        throw new Error('React component factory not registered');
      }

      console.log('🔴 [MultiImageUpload] loadReactComponent() calling factory()', {
        timestamp: new Date().toISOString(),
      });

      const { React, ReactDOM, MultiImageUpload } =
        MultiImageUploadComponent.reactComponentFactory();

      console.log('🔴 [MultiImageUpload] loadReactComponent() factory returned dependencies', {
        timestamp: new Date().toISOString(),
        hasReact: !!React,
        hasReactDOM: !!ReactDOM,
        hasMultiImageUpload: !!MultiImageUpload,
        ReactType: typeof React,
        ReactDOMType: typeof ReactDOM,
        MultiImageUploadType: typeof MultiImageUpload,
        ReactDOMHasCreateRoot: ReactDOM && typeof ReactDOM.createRoot === 'function',
      });

      logger.info('React dependencies loaded', {
        hasReact: !!React,
        hasReactDOM: !!ReactDOM,
        hasMultiImageUpload: !!MultiImageUpload,
      });

      // ✅ Reuse existing React root or create new one
      if (!this.mountedReactComponent) {
        console.log('🔴 [MultiImageUpload] loadReactComponent() creating NEW React root', {
          timestamp: new Date().toISOString(),
        });
        this.mountedReactComponent = ReactDOM.createRoot(this.reactContainer);
      } else {
        console.log('🔴 [MultiImageUpload] loadReactComponent() reusing existing React root', {
          timestamp: new Date().toISOString(),
        });
      }

      console.log('🔴 [MultiImageUpload] loadReactComponent() preparing props for render', {
        timestamp: new Date().toISOString(),
        componentProps: {
          formKey: this.component.key || 'site_images',
          maxFiles: this.component.maxFiles || UPLOAD_CONSTANTS.DEFAULT_MAX_FILES,
          compressionQuality:
            this.component.compressionQuality || UPLOAD_CONSTANTS.DEFAULT_COMPRESSION_QUALITY,
          autoNumbering: this.component.autoNumbering ?? true,
          extractMetadata: this.component.extractMetadata ?? true,
          value: this.dataValue || [],
        },
      });

      console.log('🔴 [MultiImageUpload] loadReactComponent() calling render()', {
        timestamp: new Date().toISOString(),
      });

      // ✅ Update props on existing root
      this.mountedReactComponent.render(
        React.createElement(MultiImageUpload, {
          formKey: this.component.key || 'site_images',
          maxFiles: this.component.maxFiles || UPLOAD_CONSTANTS.DEFAULT_MAX_FILES,
          compressionQuality:
            this.component.compressionQuality || UPLOAD_CONSTANTS.DEFAULT_COMPRESSION_QUALITY,
          autoNumbering: this.component.autoNumbering ?? true,
          extractMetadata: this.component.extractMetadata ?? true,
          onChange: (files: any) => {
            console.log('🔴 [MultiImageUpload] React onChange callback triggered', {
              timestamp: new Date().toISOString(),
              filesCount: files?.length,
              files,
            });

            this.setValue(files);
          },
          value: this.dataValue || [],
        })
      );

      console.log('🔴 [MultiImageUpload] loadReactComponent() render() called', {
        timestamp: new Date().toISOString(),
      });

      console.log('🔴 [MultiImageUpload] loadReactComponent() SUCCESS - React component mounted', {
        timestamp: new Date().toISOString(),
        mountedReactComponent: this.mountedReactComponent,
        containerStillInDocument: document.contains(this.reactContainer),
      });
    } catch (error) {
      console.error('🔴 [MultiImageUpload] loadReactComponent() FAILED with error', {
        timestamp: new Date().toISOString(),
        componentKey: this.component?.key,
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorType: error ? error.constructor.name : 'unknown',
      });

      logger.error('Failed to load React component', {
        componentKey: this.component?.key,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (this.reactContainer) {
        console.log(
          '🔴 [MultiImageUpload] loadReactComponent() displaying error message in container',
          {
            timestamp: new Date().toISOString(),
          }
        );
        this.reactContainer.innerHTML = `
          <div class="alert alert-danger">
            Failed to load Multi-Image Upload component. Please check console for details.
          </div>
        `;
      }
    }
  }

  destroy() {
    console.log('🔴 [MultiImageUpload] destroy() START', {
      timestamp: new Date().toISOString(),
      componentKey: this.component?.key,
      hasMountedReactComponent: !!this.mountedReactComponent,
      hasReactContainer: !!this.reactContainer,
      containerInDocument: this.reactContainer ? document.contains(this.reactContainer) : false,
    });

    if (this.mountedReactComponent) {
      console.log('🔴 [MultiImageUpload] destroy() unmounting React component', {
        timestamp: new Date().toISOString(),
        mountedComponent: this.mountedReactComponent,
      });

      try {
        this.mountedReactComponent.unmount();
        console.log('🔴 [MultiImageUpload] destroy() React component unmounted successfully', {
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('🔴 [MultiImageUpload] destroy() error unmounting React component', {
          timestamp: new Date().toISOString(),
          error,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });

        logger.warn('Error unmounting React component', {
          componentKey: this.component?.key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      this.mountedReactComponent = null;
    } else {
      console.log('🔴 [MultiImageUpload] destroy() no mounted React component to unmount', {
        timestamp: new Date().toISOString(),
      });
    }

    console.log('🔴 [MultiImageUpload] destroy() clearing reactContainer reference', {
      timestamp: new Date().toISOString(),
    });

    this.reactContainer = null;

    console.log('🔴 [MultiImageUpload] destroy() calling super.destroy()', {
      timestamp: new Date().toISOString(),
    });

    super.destroy();

    console.log('🔴 [MultiImageUpload] destroy() COMPLETE', {
      timestamp: new Date().toISOString(),
      fullCleanupComplete: true,
    });
  }

  getValue() {
    return this.dataValue || [];
  }

  setValue(value: any, flags: any = {}) {
    console.log('🔴 [MultiImageUpload] setValue() called', {
      timestamp: new Date().toISOString(),
      componentKey: this.component?.key,
      newValue: value,
      flags,
      previousValue: this.dataValue,
    });

    const changed = super.setValue(value, flags);

    console.log('🔴 [MultiImageUpload] setValue() super.setValue() result', {
      timestamp: new Date().toISOString(),
      valueChanged: changed,
      updatedDataValue: this.dataValue,
    });

    if (changed) {
      console.log('🔴 [MultiImageUpload] setValue() value changed, triggering change event', {
        timestamp: new Date().toISOString(),
        willTriggerChange: true,
      });

      this.triggerChange();

      // ✅ React component will sync via useEffect - no need to remount
      console.log('🔴 [MultiImageUpload] setValue() React will sync via useEffect', {
        timestamp: new Date().toISOString(),
        reactComponentMounted: !!this.mountedReactComponent,
      });
    }

    return changed;
  }
}
