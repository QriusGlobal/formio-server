/**
 * UppyDemo Component Unit Tests
 *
 * Comprehensive testing of Uppy plugin showcase component:
 * - Component rendering
 * - Plugin selection
 * - Plugin toggling
 * - Code example display
 * - Bundle size calculation
 * - Feature categorization
 *
 * Target: 90%+ code coverage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UppyDemo } from '../../src/components/UppyDemo';

describe('UppyDemo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render UppyDemo component with header', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Uppy File Upload/i)).toBeInTheDocument();
      expect(screen.getByText(/Feature Showcase/i)).toBeInTheDocument();
    });

    it('should render all plugin categories', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Media Capture/i)).toBeInTheDocument();
      expect(screen.getByText(/Cloud Import/i)).toBeInTheDocument();
      expect(screen.getByText(/Editors/i)).toBeInTheDocument();
      expect(screen.getByText(/Utilities/i)).toBeInTheDocument();
    });

    it('should render plugin cards', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Webcam/i)).toBeInTheDocument();
      expect(screen.getByText(/Screen Capture/i)).toBeInTheDocument();
      expect(screen.getByText(/Google Drive/i)).toBeInTheDocument();
      expect(screen.getByText(/Image Editor/i)).toBeInTheDocument();
    });

    it('should render configuration section', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Your Configuration/i)).toBeInTheDocument();
    });

    it('should render advantages section', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Why Choose Uppy/i)).toBeInTheDocument();
    });

    it('should render use case examples', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Perfect For/i)).toBeInTheDocument();
      expect(screen.getByText(/Social Media Platforms/i)).toBeInTheDocument();
      expect(screen.getByText(/Educational Platforms/i)).toBeInTheDocument();
    });
  });

  describe('Plugin Categories', () => {
    it('should display media capture plugins', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Webcam/i)).toBeInTheDocument();
      expect(screen.getByText(/Screen Capture/i)).toBeInTheDocument();
      expect(screen.getByText(/Audio Recording/i)).toBeInTheDocument();
    });

    it('should display cloud import plugins', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Google Drive/i)).toBeInTheDocument();
      expect(screen.getByText(/Dropbox/i)).toBeInTheDocument();
      expect(screen.getByText(/URL Import/i)).toBeInTheDocument();
    });

    it('should display editor plugins', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Image Editor/i)).toBeInTheDocument();
    });

    it('should display utility plugins', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Golden Retriever/i)).toBeInTheDocument();
    });

    it('should show golden retriever as enabled by default', () => {
      render(<UppyDemo />);

      const goldenRetrieverCard = screen.getByText(/Golden Retriever/i).closest('.plugin-card');
      const enableButton = goldenRetrieverCard?.querySelector('.plugin-toggle');

      expect(enableButton?.textContent).toContain('✓ Enabled');
    });
  });

  describe('Plugin Selection', () => {
    it('should select webcam plugin by default', () => {
      render(<UppyDemo />);

      const pluginDetail = screen.getByText(/Webcam Plugin/i);
      expect(pluginDetail).toBeInTheDocument();
    });

    it('should change selected plugin when card clicked', () => {
      render(<UppyDemo />);

      const screenCaptureCard = screen.getByText(/Screen Capture/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(screenCaptureCard);

      expect(screen.getByText(/Screen Capture Plugin/i)).toBeInTheDocument();
    });

    it('should update code example on plugin selection', () => {
      render(<UppyDemo />);

      const audioCard = screen.getByText(/Audio Recording/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(audioCard);

      expect(screen.getByText(/Audio Recording Plugin/i)).toBeInTheDocument();
    });

    it('should highlight selected plugin card', () => {
      render(<UppyDemo />);

      const dropboxCard = screen.getByText(/Dropbox/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(dropboxCard);

      expect(dropboxCard).toHaveClass('selected');
    });

    it('should show features for selected plugin', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(webcamCard);

      expect(screen.getByText(/Features/i)).toBeInTheDocument();
      expect(screen.getByText(/Capture photos from webcam/i)).toBeInTheDocument();
    });
  });

  describe('Plugin Toggle', () => {
    it('should toggle plugin on when enable button clicked', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card');
      const enableButton = webcamCard?.querySelector('.plugin-toggle') as HTMLElement;

      fireEvent.click(enableButton);

      expect(enableButton.textContent).toContain('✓ Enabled');
    });

    it('should toggle plugin off when already enabled', () => {
      render(<UppyDemo />);

      const goldenRetrieverCard = screen.getByText(/Golden Retriever/i).closest('.plugin-card');
      const toggleButton = goldenRetrieverCard?.querySelector('.plugin-toggle') as HTMLElement;

      expect(toggleButton.textContent).toContain('✓ Enabled');

      fireEvent.click(toggleButton);

      expect(toggleButton.textContent).toBe('Enable');
    });

    it('should stop propagation when toggle button clicked', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card');
      const enableButton = webcamCard?.querySelector('.plugin-toggle') as HTMLElement;

      // Click toggle button
      fireEvent.click(enableButton);

      // Selected plugin should remain unchanged (not switch to webcam)
      expect(screen.getByText(/Webcam Plugin/i)).toBeInTheDocument();
    });

    it('should update enabled plugin count', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/1 plugin enabled/i)).toBeInTheDocument();

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card');
      const enableButton = webcamCard?.querySelector('.plugin-toggle') as HTMLElement;

      fireEvent.click(enableButton);

      expect(screen.getByText(/2 plugins enabled/i)).toBeInTheDocument();
    });
  });

  describe('Code Examples', () => {
    it('should display code example for webcam plugin', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(webcamCard);

      expect(screen.getByText(/webcam: true/i)).toBeInTheDocument();
    });

    it('should display code example for screen capture plugin', () => {
      render(<UppyDemo />);

      const screenCaptureCard = screen.getByText(/Screen Capture/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(screenCaptureCard);

      expect(screen.getByText(/screenCapture:/i)).toBeInTheDocument();
    });

    it('should display code example for google drive plugin', () => {
      render(<UppyDemo />);

      const googleDriveCard = screen.getByText(/Google Drive/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(googleDriveCard);

      expect(screen.getByText(/googleDrive:/i)).toBeInTheDocument();
    });

    it('should display code example for image editor plugin', () => {
      render(<UppyDemo />);

      const imageEditorCard = screen.getByText(/Image Editor/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(imageEditorCard);

      expect(screen.getByText(/imageEditor:/i)).toBeInTheDocument();
    });
  });

  describe('Configuration Display', () => {
    it('should show enabled plugins in configuration', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card');
      const enableButton = webcamCard?.querySelector('.plugin-toggle') as HTMLElement;
      fireEvent.click(enableButton);

      expect(screen.getByText(/webcam: true/i)).toBeInTheDocument();
    });

    it('should update configuration when plugin toggled', () => {
      render(<UppyDemo />);

      const dropboxCard = screen.getByText(/Dropbox/i).closest('.plugin-card');
      const enableButton = dropboxCard?.querySelector('.plugin-toggle') as HTMLElement;

      fireEvent.click(enableButton);

      expect(screen.getByText(/dropbox: true/i)).toBeInTheDocument();
    });

    it('should show correct plugin count in configuration', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card');
      const webcamButton = webcamCard?.querySelector('.plugin-toggle') as HTMLElement;
      fireEvent.click(webcamButton);

      const audioCard = screen.getByText(/Audio Recording/i).closest('.plugin-card');
      const audioButton = audioCard?.querySelector('.plugin-toggle') as HTMLElement;
      fireEvent.click(audioButton);

      expect(screen.getByText(/3 plugins enabled/i)).toBeInTheDocument();
    });
  });

  describe('Bundle Size Calculation', () => {
    it('should display base Uppy size', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Base Uppy:/i)).toBeInTheDocument();
      expect(screen.getByText(/~150KB/i)).toBeInTheDocument();
    });

    it('should display total estimated size', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Total Estimated:/i)).toBeInTheDocument();
    });

    it('should update total size when plugins enabled', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card');
      const enableButton = webcamCard?.querySelector('.plugin-toggle') as HTMLElement;

      const initialText = screen.getByText(/Total Estimated:/i).nextElementSibling?.textContent;

      fireEvent.click(enableButton);

      const updatedText = screen.getByText(/Total Estimated:/i).nextElementSibling?.textContent;

      expect(updatedText).not.toBe(initialText);
    });

    it('should show bundle impact section', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Bundle Size Impact/i)).toBeInTheDocument();
    });
  });

  describe('Feature Lists', () => {
    it('should display features for webcam plugin', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(webcamCard);

      expect(screen.getByText(/Capture photos from webcam/i)).toBeInTheDocument();
      expect(screen.getByText(/Record video clips/i)).toBeInTheDocument();
    });

    it('should display features for google drive plugin', () => {
      render(<UppyDemo />);

      const googleDriveCard = screen.getByText(/Google Drive/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(googleDriveCard);

      expect(screen.getByText(/OAuth authentication/i)).toBeInTheDocument();
      expect(screen.getByText(/Browse Drive folders/i)).toBeInTheDocument();
    });

    it('should display features for golden retriever plugin', () => {
      render(<UppyDemo />);

      const goldenRetrieverCard = screen.getByText(/Golden Retriever/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(goldenRetrieverCard);

      expect(screen.getByText(/Persists upload state/i)).toBeInTheDocument();
      expect(screen.getByText(/Resumes on page load/i)).toBeInTheDocument();
    });
  });

  describe('Advantages Section', () => {
    it('should display all advantage cards', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Rich UX/i)).toBeInTheDocument();
      expect(screen.getByText(/Plugin Ecosystem/i)).toBeInTheDocument();
      expect(screen.getByText(/Cloud Integration/i)).toBeInTheDocument();
      expect(screen.getByText(/Media Capture/i)).toBeInTheDocument();
      expect(screen.getByText(/Image Editing/i)).toBeInTheDocument();
      expect(screen.getByText(/Auto-Resume/i)).toBeInTheDocument();
    });

    it('should display advantage descriptions', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Beautiful, customizable interface/i)).toBeInTheDocument();
      expect(screen.getByText(/25\+ plugins/i)).toBeInTheDocument();
    });
  });

  describe('Use Cases Section', () => {
    it('should display all use cases', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Social Media Platforms/i)).toBeInTheDocument();
      expect(screen.getByText(/Educational Platforms/i)).toBeInTheDocument();
      expect(screen.getByText(/Enterprise Applications/i)).toBeInTheDocument();
      expect(screen.getByText(/Content Creation/i)).toBeInTheDocument();
    });

    it('should display use case descriptions', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Webcam capture, image editing/i)).toBeInTheDocument();
      expect(screen.getByText(/Screen recording, audio recording/i)).toBeInTheDocument();
    });
  });

  describe('Plugin Descriptions', () => {
    it('should display plugin descriptions in cards', () => {
      render(<UppyDemo />);

      expect(screen.getByText(/Capture photos and videos from webcam/i)).toBeInTheDocument();
      expect(screen.getByText(/Record screen content/i)).toBeInTheDocument();
      expect(screen.getByText(/Import files from Google Drive/i)).toBeInTheDocument();
    });

    it('should display plugin icons', () => {
      render(<UppyDemo />);

      // Check for emoji icons
      expect(screen.getByText(/📷/)).toBeInTheDocument(); // Webcam
      expect(screen.getByText(/🖥️/)).toBeInTheDocument(); // Screen Capture
      expect(screen.getByText(/📁/)).toBeInTheDocument(); // Google Drive
    });
  });

  describe('Plugin Grid Layout', () => {
    it('should render plugins in grid layout', () => {
      render(<UppyDemo />);

      const pluginGrids = document.querySelectorAll('.plugin-grid');
      expect(pluginGrids.length).toBeGreaterThan(0);
    });

    it('should group plugins by category', () => {
      render(<UppyDemo />);

      const categories = document.querySelectorAll('.plugin-category');
      expect(categories.length).toBe(4); // Media, Cloud, Editor, Utility
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<UppyDemo />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('should have proper heading hierarchy', () => {
      render(<UppyDemo />);

      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toBeInTheDocument();

      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s.length).toBeGreaterThan(0);
    });
  });

  describe('State Management', () => {
    it('should maintain plugin enabled state', () => {
      render(<UppyDemo />);

      const webcamCard = screen.getByText(/Webcam/i).closest('.plugin-card');
      const enableButton = webcamCard?.querySelector('.plugin-toggle') as HTMLElement;

      fireEvent.click(enableButton);

      expect(enableButton.textContent).toContain('✓ Enabled');

      // Click again to disable
      fireEvent.click(enableButton);

      expect(enableButton.textContent).toBe('Enable');
    });

    it('should maintain selected plugin state', () => {
      render(<UppyDemo />);

      const audioCard = screen.getByText(/Audio Recording/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(audioCard);

      expect(screen.getByText(/Audio Recording Plugin/i)).toBeInTheDocument();

      // Select another plugin
      const dropboxCard = screen.getByText(/Dropbox/i).closest('.plugin-card') as HTMLElement;
      fireEvent.click(dropboxCard);

      expect(screen.getByText(/Dropbox Plugin/i)).toBeInTheDocument();
      expect(screen.queryByText(/Audio Recording Plugin/i)).not.toBeInTheDocument();
    });
  });
});