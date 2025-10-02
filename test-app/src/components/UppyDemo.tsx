/**
 * UppyDemo Component
 *
 * Interactive demonstration of Uppy file upload with plugin ecosystem.
 * Shows advanced features including webcam, screen capture, cloud imports, and image editing.
 */

import React, { useState } from 'react';

interface Plugin {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'media' | 'cloud' | 'editor' | 'utility';
  enabled: boolean;
}

export const UppyDemo: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: 'webcam',
      name: 'Webcam',
      icon: '📷',
      description: 'Capture photos and videos from webcam',
      category: 'media',
      enabled: false,
    },
    {
      id: 'screen-capture',
      name: 'Screen Capture',
      icon: '🖥️',
      description: 'Record screen content',
      category: 'media',
      enabled: false,
    },
    {
      id: 'audio',
      name: 'Audio Recording',
      icon: '🎤',
      description: 'Record audio directly in browser',
      category: 'media',
      enabled: false,
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: '📁',
      description: 'Import files from Google Drive',
      category: 'cloud',
      enabled: false,
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '📦',
      description: 'Import files from Dropbox',
      category: 'cloud',
      enabled: false,
    },
    {
      id: 'url',
      name: 'URL Import',
      icon: '🔗',
      description: 'Import files from any URL',
      category: 'cloud',
      enabled: false,
    },
    {
      id: 'image-editor',
      name: 'Image Editor',
      icon: '✂️',
      description: 'Crop, rotate, and edit images',
      category: 'editor',
      enabled: false,
    },
    {
      id: 'golden-retriever',
      name: 'Golden Retriever',
      icon: '🐕',
      description: 'Auto-resume across sessions',
      category: 'utility',
      enabled: true,
    },
  ]);

  const [selectedPlugin, setSelectedPlugin] = useState<string>('webcam');

  const togglePlugin = (pluginId: string) => {
    setPlugins(prev =>
      prev.map(p =>
        p.id === pluginId ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const codeExamples: Record<string, string> = {
    webcam: `import { UppyFileUpload } from '@formio/react';

<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
    webcam: true, // Enable webcam capture
  }}
  uppyOptions={{
    restrictions: {
      allowedFileTypes: ['image/*', 'video/*']
    }
  }}
/>

// Users can capture photos/videos directly`,
    'screen-capture': `<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
    screenCapture: {
      enabled: true,
      preferredTypes: ['screen', 'window', 'tab']
    }
  }}
/>

// Capture screen, window, or tab content`,
    audio: `<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
    audio: {
      enabled: true,
      showRecordingLength: true,
      showAudioSourceDropdown: true
    }
  }}
/>

// Record audio with visual feedback`,
    'google-drive': `<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
    googleDrive: {
      enabled: true,
      companionUrl: 'https://companion.uppy.io'
    }
  }}
/>

// Import files directly from Google Drive`,
    dropbox: `<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
    dropbox: {
      enabled: true,
      companionUrl: 'https://companion.uppy.io'
    }
  }}
/>

// Import files from Dropbox`,
    url: `<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
    url: true // Import from any URL
  }}
/>

// Users can paste URLs to import files`,
    'image-editor': `<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
    imageEditor: {
      enabled: true,
      quality: 0.8,
      actions: {
        revert: true,
        rotate: true,
        granularRotate: true,
        flip: true,
        zoomIn: true,
        zoomOut: true,
        cropSquare: true,
        cropWidescreen: true,
        cropWidescreenVertical: true
      }
    }
  }}
/>

// Full image editing before upload`,
    'golden-retriever': `<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
    goldenRetriever: true // Auto-enabled by default
  }}
/>

// Automatically resumes uploads:
// - After page refresh
// - After browser restart
// - After network reconnection
// - Across multiple sessions`,
  };

  const pluginFeatures: Record<string, string[]> = {
    webcam: [
      'Capture photos from webcam',
      'Record video clips',
      'Picture-in-picture mode',
      'Multiple camera support',
      'Front/back camera toggle on mobile',
    ],
    'screen-capture': [
      'Record entire screen',
      'Capture specific window',
      'Tab recording',
      'Cursor capture toggle',
      'Audio input selection',
    ],
    audio: [
      'Browser-based recording',
      'Multiple audio source selection',
      'Real-time waveform visualization',
      'Recording length indicator',
      'Pause/resume recording',
    ],
    'google-drive': [
      'OAuth authentication',
      'Browse Drive folders',
      'Search functionality',
      'Multiple file selection',
      'Folder navigation',
    ],
    dropbox: [
      'OAuth authentication',
      'Browse folders',
      'File search',
      'Batch selection',
      'Folder structure navigation',
    ],
    url: [
      'Import from any public URL',
      'HTTP/HTTPS support',
      'Automatic file type detection',
      'Progress indication',
      'Error handling for invalid URLs',
    ],
    'image-editor': [
      'Crop to preset ratios',
      'Free-form cropping',
      'Rotate 90° steps',
      'Granular rotation',
      'Flip horizontal/vertical',
      'Zoom in/out controls',
    ],
    'golden-retriever': [
      'Persists upload state to localStorage',
      'Resumes on page load',
      'Survives browser restart',
      'Works across sessions',
      'Automatic cleanup of old data',
    ],
  };

  const getPluginsByCategory = (category: string) => {
    return plugins.filter(p => p.category === category);
  };

  const categories = [
    { id: 'media', name: 'Media Capture', icon: '🎬' },
    { id: 'cloud', name: 'Cloud Import', icon: '☁️' },
    { id: 'editor', name: 'Editors', icon: '✏️' },
    { id: 'utility', name: 'Utilities', icon: '🔧' },
  ];

  return (
    <div className="uppy-demo-container" data-testid="uppy-demo-container">
      <div className="demo-header" data-testid="uppy-demo-header">
        <h2>⚡ Uppy File Upload - Feature Showcase</h2>
        <p>Explore the rich plugin ecosystem and advanced capabilities</p>
      </div>

      <div className="plugin-categories" data-testid="plugin-categories">
        {categories.map(category => (
          <div key={category.id} className="plugin-category" data-testid={`plugin-category-${category.id}`}>
            <h3>
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </h3>
            <div className="plugin-grid" data-testid={`plugin-grid-${category.id}`}>
              {getPluginsByCategory(category.id).map(plugin => (
                <div
                  key={plugin.id}
                  className={`plugin-card ${plugin.enabled ? 'enabled' : ''} ${
                    selectedPlugin === plugin.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedPlugin(plugin.id)}
                  data-testid={`plugin-card-${plugin.id}`}
                >
                  <div className="plugin-header">
                    <span className="plugin-icon">{plugin.icon}</span>
                    <h4>{plugin.name}</h4>
                  </div>
                  <p className="plugin-description">{plugin.description}</p>
                  <button
                    className={`plugin-toggle ${plugin.enabled ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlugin(plugin.id);
                    }}
                    data-testid={`plugin-toggle-${plugin.id}`}
                  >
                    {plugin.enabled ? '✓ Enabled' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="plugin-detail" data-testid="plugin-detail">
        <div className="detail-header" data-testid="plugin-detail-header">
          <h3>
            {plugins.find(p => p.id === selectedPlugin)?.icon}{' '}
            {plugins.find(p => p.id === selectedPlugin)?.name} Plugin
          </h3>
        </div>

        <div className="detail-content" data-testid="plugin-detail-content">
          <div className="detail-features" data-testid="plugin-detail-features">
            <h4>Features</h4>
            <ul>
              {pluginFeatures[selectedPlugin]?.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          <div className="detail-code" data-testid="plugin-detail-code">
            <h4>Implementation</h4>
            <pre className="code-block" data-testid="plugin-code-example">
              <code>{codeExamples[selectedPlugin]}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="enabled-plugins-summary" data-testid="enabled-plugins-summary">
        <h3>Your Configuration</h3>
        <p data-testid="plugin-count">
          {plugins.filter(p => p.enabled).length} plugin
          {plugins.filter(p => p.enabled).length !== 1 ? 's' : ''} enabled
        </p>

        <pre className="config-code" data-testid="config-code-preview">
          <code>{`<UppyFileUpload
  endpoint="https://api.example.com/upload"
  plugins={{
${plugins
  .filter(p => p.enabled)
  .map(p => `    ${p.id}: true,`)
  .join('\n')}
  }}
  onSuccess={(files) => console.log(files)}
  onError={(error) => console.error(error)}
/>`}</code>
        </pre>

        <div className="bundle-impact">
          <h4>Bundle Size Impact</h4>
          <div className="size-calculation">
            <div className="size-item">
              <span>Base Uppy:</span>
              <span>~150KB</span>
            </div>
            {plugins
              .filter(p => p.enabled && p.id !== 'golden-retriever')
              .map(p => (
                <div key={p.id} className="size-item">
                  <span>{p.name}:</span>
                  <span>~{Math.floor(Math.random() * 40) + 20}KB</span>
                </div>
              ))}
            <div className="size-total">
              <span>Total Estimated:</span>
              <span>~{150 + plugins.filter(p => p.enabled).length * 30}KB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="uppy-advantages">
        <h3>Why Choose Uppy?</h3>
        <div className="advantages-grid">
          <div className="advantage-card">
            <div className="advantage-icon">🎨</div>
            <h4>Rich UX</h4>
            <p>Beautiful, customizable interface with modern design patterns</p>
          </div>
          <div className="advantage-card">
            <div className="advantage-icon">🔌</div>
            <h4>Plugin Ecosystem</h4>
            <p>25+ plugins covering media, cloud, editing, and utilities</p>
          </div>
          <div className="advantage-card">
            <div className="advantage-icon">🌐</div>
            <h4>Cloud Integration</h4>
            <p>Import from Google Drive, Dropbox, Instagram, and more</p>
          </div>
          <div className="advantage-card">
            <div className="advantage-icon">📸</div>
            <h4>Media Capture</h4>
            <p>Webcam, screen recording, and audio capture built-in</p>
          </div>
          <div className="advantage-card">
            <div className="advantage-icon">✂️</div>
            <h4>Image Editing</h4>
            <p>Crop, rotate, and edit images before upload</p>
          </div>
          <div className="advantage-card">
            <div className="advantage-icon">🔄</div>
            <h4>Auto-Resume</h4>
            <p>Golden Retriever plugin resumes uploads across sessions</p>
          </div>
        </div>
      </div>

      <div className="use-case-examples">
        <h3>Perfect For</h3>
        <div className="use-cases">
          <div className="use-case">
            <h4>📱 Social Media Platforms</h4>
            <p>Webcam capture, image editing, and cloud imports</p>
          </div>
          <div className="use-case">
            <h4>🎓 Educational Platforms</h4>
            <p>Screen recording, audio recording, and file management</p>
          </div>
          <div className="use-case">
            <h4>💼 Enterprise Applications</h4>
            <p>Cloud integration, security features, and compliance</p>
          </div>
          <div className="use-case">
            <h4>🎮 Content Creation</h4>
            <p>Media capture, editing tools, and rich preview</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UppyDemo;