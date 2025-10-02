/**
 * Template registration for file upload components
 *
 * Provides clean, framework-agnostic templates with minimal CSS
 */

export function registerTemplates(framework: string = 'default') {
  const templates: Record<string, any> = {};

  // All frameworks use clean, vanilla HTML/CSS templates
  templates.tusupload = {
    form: getTusTemplate()
  };
  templates.uppyupload = {
    form: getUppyTemplate()
  };

  return templates;
}

function getTusTemplate() {
  return `
<div class="tus-upload-component">
  <style>
    .tus-upload-component { margin: 1rem 0; font-family: system-ui, -apple-system, sans-serif; }
    .tus-upload-component label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .upload-dropzone {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      background: #fafafa;
      transition: all 0.2s;
    }
    .upload-dropzone:hover { border-color: #666; background: #f0f0f0; }
    .upload-dropzone.dragover { border-color: #4CAF50; background: #e8f5e9; }
    .upload-icon { font-size: 3rem; color: #999; margin-bottom: 1rem; }
    .browse-button {
      background: #2196F3;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .browse-button:hover { background: #1976D2; }
    .file-input { display: none; }
    .file-list { margin-top: 1rem; }
    .file-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: white;
    }
    .file-name { flex: 1; margin: 0 1rem; }
    .file-size { color: #666; font-size: 0.875rem; }
    .progress-bar {
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin: 0 1rem;
      flex: 1;
    }
    .progress-fill {
      height: 100%;
      background: #4CAF50;
      transition: width 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
    }
    .remove-button {
      background: #f44336;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .remove-button:hover { background: #d32f2f; }
    .description { display: block; margin-top: 0.5rem; font-size: 0.875rem; color: #666; }
  </style>

  <label for="{{ instance.id }}-{{ key }}">{{ t(label) }}</label>

  <div class="upload-dropzone" ref="fileDrop">
    <div class="upload-icon">📁</div>
    <p>{{ t('Drag and drop files here or') }}</p>
    <button type="button" class="browse-button" ref="fileBrowse">
      {{ t('Browse Files') }}
    </button>
    <input type="file" class="file-input" ref="hiddenFileInputElement"
      {% if (multiple) { %}multiple{% } %}
      {% if (filePattern && filePattern !== '*') { %}accept="{{ filePattern }}"{% } %} />
  </div>

  <div class="file-list" ref="fileList">
    {% if (files && files.length) { %}
      {% files.forEach(function(file, index) { %}
        <div class="file-item">
          <span>📄</span>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatBytes(file.size) }}</span>
          {% if (file.progress && file.progress < 100) { %}
            <div class="progress-bar">
              <div class="progress-fill" ref="fileProgress" style="width: {{ file.progress }}%">
                {{ file.progress }}%
              </div>
            </div>
          {% } %}
          {% if (file.status === 'completed') { %}
            <span style="color: #4CAF50;">✓</span>
          {% } %}
          <button type="button" class="remove-button" ref="removeLink">×</button>
        </div>
      {% }); %}
    {% } %}
  </div>

  {% if (description) { %}
    <small class="description">{{ t(description) }}</small>
  {% } %}
</div>
  `;
}

function getUppyTemplate() {
  return `
<div class="uppy-upload-component">
  <style>
    .uppy-upload-component { margin: 1rem 0; font-family: system-ui, -apple-system, sans-serif; }
    .uppy-upload-component label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .uppy-dashboard-container {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .description { display: block; margin-top: 0.5rem; font-size: 0.875rem; color: #666; }
  </style>

  <label for="{{ instance.id }}-{{ key }}">{{ t(label) }}</label>

  <div class="uppy-dashboard-container"></div>

  {% if (description) { %}
    <small class="description">{{ t(description) }}</small>
  {% } %}
</div>
  `;
}