/**
 * FeatureComparison Component
 *
 * Interactive comparison table showing feature availability,
 * performance benchmarks, and decision guidance.
 */

import React, { useState } from 'react';

interface Feature {
  name: string;
  category: string;
  tus: boolean | string;
  uppy: boolean | string;
  description: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

const features: Feature[] = [
  // Core Upload Features
  {
    name: 'Resumable Uploads',
    category: 'Core',
    tus: true,
    uppy: true,
    description: 'Continue uploads after network interruption',
    importance: 'critical',
  },
  {
    name: 'Pause/Resume Control',
    category: 'Core',
    tus: true,
    uppy: true,
    description: 'Manual control over upload progress',
    importance: 'high',
  },
  {
    name: 'Multiple File Upload',
    category: 'Core',
    tus: true,
    uppy: true,
    description: 'Upload multiple files simultaneously',
    importance: 'critical',
  },
  {
    name: 'Drag & Drop',
    category: 'Core',
    tus: true,
    uppy: true,
    description: 'Intuitive file selection via drag and drop',
    importance: 'high',
  },
  {
    name: 'Progress Tracking',
    category: 'Core',
    tus: true,
    uppy: true,
    description: 'Real-time upload progress with speed and ETA',
    importance: 'critical',
  },
  {
    name: 'Image Preview',
    category: 'Core',
    tus: true,
    uppy: true,
    description: 'Thumbnail previews for image files',
    importance: 'medium',
  },
  {
    name: 'File Validation',
    category: 'Core',
    tus: true,
    uppy: true,
    description: 'Size and type validation before upload',
    importance: 'critical',
  },
  {
    name: 'Error Handling',
    category: 'Core',
    tus: true,
    uppy: true,
    description: 'Graceful error recovery and retry logic',
    importance: 'critical',
  },

  // Advanced Features
  {
    name: 'Webcam Capture',
    category: 'Media',
    tus: false,
    uppy: true,
    description: 'Capture photos/videos directly from webcam',
    importance: 'medium',
  },
  {
    name: 'Screen Recording',
    category: 'Media',
    tus: false,
    uppy: true,
    description: 'Record screen content for upload',
    importance: 'low',
  },
  {
    name: 'Audio Recording',
    category: 'Media',
    tus: false,
    uppy: true,
    description: 'Record audio directly in browser',
    importance: 'low',
  },
  {
    name: 'Image Editor',
    category: 'Media',
    tus: false,
    uppy: true,
    description: 'Crop, rotate, and edit images before upload',
    importance: 'medium',
  },

  // Cloud Integration
  {
    name: 'Google Drive Import',
    category: 'Cloud',
    tus: false,
    uppy: true,
    description: 'Import files from Google Drive',
    importance: 'medium',
  },
  {
    name: 'Dropbox Import',
    category: 'Cloud',
    tus: false,
    uppy: true,
    description: 'Import files from Dropbox',
    importance: 'medium',
  },
  {
    name: 'OneDrive Import',
    category: 'Cloud',
    tus: false,
    uppy: true,
    description: 'Import files from OneDrive',
    importance: 'low',
  },
  {
    name: 'URL Import',
    category: 'Cloud',
    tus: false,
    uppy: true,
    description: 'Import files from any URL',
    importance: 'medium',
  },

  // Performance & Reliability
  {
    name: 'Golden Retriever',
    category: 'Reliability',
    tus: false,
    uppy: true,
    description: 'Auto-resume uploads across browser sessions',
    importance: 'high',
  },
  {
    name: 'Chunked Upload',
    category: 'Performance',
    tus: '1MB-25MB dynamic',
    uppy: '5MB default',
    description: 'Upload large files in smaller chunks',
    importance: 'critical',
  },
  {
    name: 'Parallel Uploads',
    category: 'Performance',
    tus: '3 concurrent',
    uppy: '5 concurrent',
    description: 'Upload multiple files simultaneously',
    importance: 'high',
  },
  {
    name: 'Retry Strategy',
    category: 'Reliability',
    tus: 'Exponential backoff',
    uppy: 'Configurable',
    description: 'Automatic retry on failure',
    importance: 'critical',
  },

  // Developer Experience
  {
    name: 'Bundle Size',
    category: 'DX',
    tus: '45KB',
    uppy: '380KB',
    description: 'JavaScript bundle size impact',
    importance: 'high',
  },
  {
    name: 'Memory Usage',
    category: 'DX',
    tus: '8.2MB',
    uppy: '15.6MB',
    description: 'Runtime memory consumption',
    importance: 'medium',
  },
  {
    name: 'TypeScript Support',
    category: 'DX',
    tus: true,
    uppy: true,
    description: 'Full TypeScript definitions',
    importance: 'high',
  },
  {
    name: 'Custom Styling',
    category: 'DX',
    tus: 'CSS classes',
    uppy: 'Themes + CSS',
    description: 'Customization options',
    importance: 'medium',
  },
  {
    name: 'Accessibility',
    category: 'DX',
    tus: 'WCAG 2.1 AA',
    uppy: 'WCAG 2.1 AA',
    description: 'Keyboard navigation and ARIA support',
    importance: 'critical',
  },
];

export const FeatureComparison: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'importance'>('importance');

  const categories = ['all', ...Array.from(new Set(features.map(f => f.category)))];

  const filteredFeatures = features.filter(
    f => selectedCategory === 'all' || f.category === selectedCategory
  );

  const sortedFeatures = [...filteredFeatures].sort((a, b) => {
    if (sortBy === 'importance') {
      const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return importanceOrder[a.importance] - importanceOrder[b.importance];
    }
    return a.name.localeCompare(b.name);
  });

  const getFeatureDisplay = (value: boolean | string): React.ReactNode => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="feature-check">✓</span>
      ) : (
        <span className="feature-cross">✗</span>
      );
    }
    return <span className="feature-value">{value}</span>;
  };

  const getImportanceBadge = (importance: Feature['importance']): React.ReactNode => {
    const colors = {
      critical: '#ff4444',
      high: '#ff8800',
      medium: '#ffbb00',
      low: '#00bb00',
    };
    return (
      <span
        className="importance-badge"
        style={{ backgroundColor: colors[importance] }}
      >
        {importance}
      </span>
    );
  };

  const calculateScores = () => {
    const tusScore = features.filter(f => f.tus === true || typeof f.tus === 'string').length;
    const uppyScore = features.filter(f => f.uppy === true || typeof f.uppy === 'string').length;
    const totalFeatures = features.length;

    return {
      tus: Math.round((tusScore / totalFeatures) * 100),
      uppy: Math.round((uppyScore / totalFeatures) * 100),
      tusCount: tusScore,
      uppyCount: uppyScore,
    };
  };

  const scores = calculateScores();

  return (
    <div className="feature-comparison-container">
      <div className="comparison-header">
        <h2>Feature Matrix Comparison</h2>
        <p>Detailed side-by-side feature comparison to help you make an informed decision.</p>
      </div>

      <div className="feature-scores">
        <div className="score-card tus-score">
          <h3>TUS (Basic)</h3>
          <div className="score-value">{scores.tusCount}/{features.length}</div>
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${scores.tus}%` }}></div>
          </div>
          <p>{scores.tus}% feature coverage</p>
        </div>
        <div className="score-card uppy-score">
          <h3>Uppy (Enhanced)</h3>
          <div className="score-value">{scores.uppyCount}/{features.length}</div>
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${scores.uppy}%` }}></div>
          </div>
          <p>{scores.uppy}% feature coverage</p>
        </div>
      </div>

      <div className="feature-controls">
        <div className="control-group">
          <label>Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'importance')}
            className="sort-select"
          >
            <option value="importance">Importance</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="feature-table-container">
        <table className="feature-table">
          <thead>
            <tr>
              <th className="feature-name-col">Feature</th>
              <th className="feature-category-col">Category</th>
              <th className="feature-importance-col">Priority</th>
              <th className="feature-tus-col">TUS</th>
              <th className="feature-uppy-col">Uppy</th>
              <th className="feature-description-col">Description</th>
            </tr>
          </thead>
          <tbody>
            {sortedFeatures.map((feature, index) => (
              <tr key={index} className={`feature-row importance-${feature.importance}`}>
                <td className="feature-name">{feature.name}</td>
                <td className="feature-category">
                  <span className="category-badge">{feature.category}</span>
                </td>
                <td className="feature-importance">
                  {getImportanceBadge(feature.importance)}
                </td>
                <td className="feature-tus">
                  {getFeatureDisplay(feature.tus)}
                </td>
                <td className="feature-uppy">
                  {getFeatureDisplay(feature.uppy)}
                </td>
                <td className="feature-description">{feature.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="feature-summary">
        <h3>Key Takeaways</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>🎯 TUS Strengths</h4>
            <ul>
              <li>Covers all critical upload features</li>
              <li>Minimal bundle size (45KB)</li>
              <li>Lower memory footprint</li>
              <li>Fast implementation time</li>
              <li>Production-ready reliability</li>
            </ul>
          </div>
          <div className="summary-card">
            <h4>⚡ Uppy Strengths</h4>
            <ul>
              <li>Comprehensive feature set</li>
              <li>Advanced media capture</li>
              <li>Cloud service integration</li>
              <li>Rich user experience</li>
              <li>Extensive plugin ecosystem</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureComparison;