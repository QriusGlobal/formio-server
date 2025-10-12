import { Components } from '@formio/js';
import MultiImageUploadComponent from './Component';

describe('MultiImageUploadComponent', () => {
  beforeAll(() => {
    (Components as any).setComponent('multiimageupload', MultiImageUploadComponent);
  });

  it('should define schema correctly', () => {
    const schema = MultiImageUploadComponent.schema();
    expect(schema.type).toBe('multiimageupload');
    expect(schema.key).toBe('site_images');
    expect(schema.maxFiles).toBe(20);
    expect(schema.compressionQuality).toBe(0.8);
    expect(schema.autoNumbering).toBe(true);
    expect(schema.extractMetadata).toBe(true);
  });

  it('should have correct builderInfo', () => {
    const info = MultiImageUploadComponent.builderInfo;
    expect(info.title).toBe('Multi-Image Upload');
    expect(info.group).toBe('premium');
    expect(info.icon).toBe('images');
    expect(info.weight).toBe(102);
  });

  it('should register with Form.io', () => {
    const component = (Components as any).create(
      {
        type: 'multiimageupload',
        key: 'site_images',
      },
      {},
      {}
    );
    expect(component).toBeInstanceOf(MultiImageUploadComponent);
  });

  it('should handle setValue/getValue', () => {
    const component = new MultiImageUploadComponent(
      {
        type: 'multiimageupload',
        key: 'site_images',
      },
      {},
      {}
    );

    const testValue = [
      {
        url: 'http://test.com/1',
        name: 'Site Image 1',
        number: 1,
        timestamp: Date.now(),
        size: 1024,
        type: 'image/jpeg',
      },
    ];

    component.setValue(testValue);
    expect(component.getValue()).toEqual(testValue);
  });

  it('should return empty array for getValue when no data', () => {
    const component = new MultiImageUploadComponent(
      {
        type: 'multiimageupload',
        key: 'site_images',
      },
      {},
      {}
    );

    expect(component.getValue()).toEqual([]);
  });

  it('should have proper schema defaults', () => {
    const schema = MultiImageUploadComponent.schema();
    expect(schema.storage).toBe('url');
    expect(schema.url).toBe('http://localhost:1080/files/');
    expect(schema.filePattern).toBe('image/*,video/*');
    expect(schema.fileMaxSize).toBe('10MB');
  });

  it('should allow schema extension', () => {
    const schema = MultiImageUploadComponent.schema({
      maxFiles: 50,
      customProp: 'test',
    });
    expect(schema.maxFiles).toBe(50);
    expect((schema as any).customProp).toBe('test');
  });
});
