/**
 * TusDemo Component Unit Tests
 *
 * Comprehensive testing of TUS upload component:
 * - Component rendering
 * - File selection and upload initiation
 * - Upload progress tracking
 * - Pause/resume functionality
 * - Error handling
 * - Multiple file uploads
 * - UI state management
 *
 * Target: 90%+ code coverage
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TusDemo } from '../../src/components/TusDemo';
import * as tus from 'tus-js-client';

// Mock tus-js-client
vi.mock('tus-js-client', () => ({
  Upload: vi.fn(),
}));

describe('TusDemo Component', () => {
  let mockUpload: any;
  let mockFile: File;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock file
    mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

    // Create mock upload instance
    mockUpload = {
      start: vi.fn(),
      abort: vi.fn(),
      url: 'http://localhost:1080/files/test-id',
    };

    // Mock Upload constructor
    (tus.Upload as any).mockImplementation((file: File, options: any) => {
      // Store callbacks for later invocation
      mockUpload.options = options;
      return mockUpload;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render TusDemo component with header', () => {
      render(<TusDemo />);

      expect(screen.getByText(/TUS File Upload/i)).toBeInTheDocument();
      expect(screen.getByText(/REAL Implementation/i)).toBeInTheDocument();
    });

    it('should render feature buttons', () => {
      render(<TusDemo />);

      expect(screen.getByText(/Basic Upload/i)).toBeInTheDocument();
      expect(screen.getByText(/Pause\/Resume/i)).toBeInTheDocument();
      expect(screen.getByText(/Multiple Files/i)).toBeInTheDocument();
      expect(screen.getByText(/Validation/i)).toBeInTheDocument();
      expect(screen.getByText(/Progress Tracking/i)).toBeInTheDocument();
      expect(screen.getByText(/Error Handling/i)).toBeInTheDocument();
    });

    it('should render file input button', () => {
      render(<TusDemo />);

      expect(screen.getByText(/Select Files to Upload/i)).toBeInTheDocument();
    });

    it('should render empty state initially', () => {
      render(<TusDemo />);

      expect(screen.getByText(/Click "Select Files" to start/i)).toBeInTheDocument();
    });

    it('should render code example section', () => {
      render(<TusDemo />);

      expect(screen.getByText(/Code Example/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Features/i)).toBeInTheDocument();
    });

    it('should render benefits section', () => {
      render(<TusDemo />);

      expect(screen.getByText(/Why TUS Protocol/i)).toBeInTheDocument();
      expect(screen.getByText(/Lightweight/i)).toBeInTheDocument();
      expect(screen.getByText(/Reliable/i)).toBeInTheDocument();
    });
  });

  describe('Feature Selection', () => {
    it('should select basic upload feature by default', () => {
      render(<TusDemo />);

      const basicButton = screen.getByText(/Basic Upload/i).closest('button');
      expect(basicButton).toHaveClass('active');
    });

    it('should switch to pause-resume feature', () => {
      render(<TusDemo />);

      const pauseResumeButton = screen.getByText(/Pause\/Resume/i);
      fireEvent.click(pauseResumeButton);

      expect(screen.getByText(/upload\.abort\(\)/i)).toBeInTheDocument();
    });

    it('should switch to multiple files feature', () => {
      render(<TusDemo />);

      const multipleButton = screen.getByText(/Multiple Files/i);
      fireEvent.click(multipleButton);

      expect(screen.getByText(/forEach/i)).toBeInTheDocument();
    });

    it('should update code example when feature changes', () => {
      render(<TusDemo />);

      const validationButton = screen.getByText(/Validation/i);
      fireEvent.click(validationButton);

      expect(screen.getByText(/File too large/i)).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should handle file selection', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(screen.getByText('test.txt')).toBeInTheDocument();
      });
    });

    it('should display file size', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(screen.getByText(/B/)).toBeInTheDocument(); // Size displayed
      });
    });

    it('should create Upload instance when file selected', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(tus.Upload).toHaveBeenCalledWith(
          mockFile,
          expect.objectContaining({
            endpoint: 'http://localhost:1080/files/',
            chunkSize: 1024 * 1024,
          })
        );
      });
    });

    it('should start upload automatically', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.start).toHaveBeenCalled();
      });
    });

    it('should handle multiple file selection', async () => {
      const files = [
        new File(['content1'], 'file1.txt', { type: 'text/plain' }),
        new File(['content2'], 'file2.txt', { type: 'text/plain' }),
      ];

      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files },
      });

      await waitFor(() => {
        expect(screen.getByText('file1.txt')).toBeInTheDocument();
        expect(screen.getByText('file2.txt')).toBeInTheDocument();
      });
    });

    it('should create separate Upload instance for each file', async () => {
      const files = [
        new File(['content1'], 'file1.txt', { type: 'text/plain' }),
        new File(['content2'], 'file2.txt', { type: 'text/plain' }),
      ];

      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files },
      });

      await waitFor(() => {
        expect(tus.Upload).toHaveBeenCalledTimes(2);
      });
    });

    it('should reset file input after selection', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(fileInput.value).toBe('');
      });
    });
  });

  describe('Upload Progress', () => {
    it('should update progress during upload', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      // Simulate progress update
      mockUpload.options.onProgress(500, 1000);

      await waitFor(() => {
        expect(screen.getByText(/50%/)).toBeInTheDocument();
      });
    });

    it('should display upload speed', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      mockUpload.options.onProgress(1024000, 2048000);

      await waitFor(() => {
        expect(screen.getByText(/KB\/s/)).toBeInTheDocument();
      });
    });

    it('should calculate time remaining', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      mockUpload.options.onProgress(500000, 1000000);

      await waitFor(() => {
        expect(screen.getByText(/ETA:/)).toBeInTheDocument();
      });
    });

    it('should show progress bar during upload', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      mockUpload.options.onProgress(750, 1000);

      await waitFor(() => {
        const progressBar = document.querySelector('.progress-fill') as HTMLElement;
        expect(progressBar).toBeInTheDocument();
        expect(progressBar.style.width).toBe('75%');
      });
    });
  });

  describe('Upload Completion', () => {
    it('should show success state on completion', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      mockUpload.options.onSuccess();

      await waitFor(() => {
        expect(screen.getByText(/✓ Complete/i)).toBeInTheDocument();
      });
    });

    it('should display upload URL on success', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      mockUpload.options.onSuccess();

      await waitFor(() => {
        expect(screen.getByText(/Uploaded to:/i)).toBeInTheDocument();
        expect(screen.getByText(mockUpload.url)).toBeInTheDocument();
      });
    });

    it('should set progress to 100% on success', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      mockUpload.options.onSuccess();

      await waitFor(() => {
        expect(screen.getByText(/100%/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle upload errors', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      const error = new Error('Network error');
      mockUpload.options.onError(error);

      await waitFor(() => {
        expect(screen.getByText(/✗ Error:/i)).toBeInTheDocument();
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });

    it('should display error message to user', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      mockUpload.options.onError(new Error('Server unavailable'));

      await waitFor(() => {
        expect(screen.getByText(/Server unavailable/i)).toBeInTheDocument();
      });
    });

    it('should log errors to console', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(mockUpload.options).toBeDefined();
      });

      const error = new Error('Upload failed');
      mockUpload.options.onError(error);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('TUS Upload Error:', error);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Pause and Resume', () => {
    it('should pause upload when pause button clicked', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        mockUpload.options.onProgress(500, 1000);
      });

      await waitFor(() => {
        expect(screen.getByText(/⏸ Pause/i)).toBeInTheDocument();
      });

      const pauseButton = screen.getByText(/⏸ Pause/i);
      fireEvent.click(pauseButton);

      await waitFor(() => {
        expect(mockUpload.abort).toHaveBeenCalled();
        expect(screen.getByText(/▶ Resume/i)).toBeInTheDocument();
      });
    });

    it('should resume upload when resume button clicked', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        mockUpload.options.onProgress(500, 1000);
      });

      // Pause
      const pauseButton = screen.getByText(/⏸ Pause/i);
      fireEvent.click(pauseButton);

      await waitFor(() => {
        expect(screen.getByText(/▶ Resume/i)).toBeInTheDocument();
      });

      // Resume
      const resumeButton = screen.getByText(/▶ Resume/i);
      fireEvent.click(resumeButton);

      await waitFor(() => {
        expect(mockUpload.start).toHaveBeenCalledTimes(2); // Initial + resume
      });
    });

    it('should maintain progress when paused', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        mockUpload.options.onProgress(600, 1000);
      });

      await waitFor(() => {
        expect(screen.getByText(/60%/)).toBeInTheDocument();
      });

      const pauseButton = screen.getByText(/⏸ Pause/i);
      fireEvent.click(pauseButton);

      await waitFor(() => {
        // Progress should still show 60%
        expect(screen.getByText(/60%/)).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Upload', () => {
    it('should cancel upload when cancel button clicked', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(screen.getByText('test.txt')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText(/✕ Cancel/i);
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(mockUpload.abort).toHaveBeenCalled();
        expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
      });
    });

    it('should remove file from list after cancellation', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(screen.getByText('test.txt')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText(/✕ Cancel/i);
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
      });
    });
  });

  describe('Statistics Display', () => {
    it('should display total files count', async () => {
      const files = [
        new File(['content1'], 'file1.txt', { type: 'text/plain' }),
        new File(['content2'], 'file2.txt', { type: 'text/plain' }),
      ];

      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files },
      });

      await waitFor(() => {
        const totalStat = screen.getByText(/Total Files/i).nextElementSibling;
        expect(totalStat?.textContent).toBe('2');
      });
    });

    it('should display completed files count', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        mockUpload.options.onSuccess();
      });

      await waitFor(() => {
        const completedStat = screen.getByText(/Completed/i).nextElementSibling;
        expect(completedStat?.textContent).toBe('1');
      });
    });

    it('should display in progress files count', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        mockUpload.options.onProgress(500, 1000);
      });

      await waitFor(() => {
        const inProgressStat = screen.getByText(/In Progress/i).nextElementSibling;
        expect(inProgressStat?.textContent).toBe('1');
      });
    });
  });

  describe('Utility Functions', () => {
    it('should format file sizes correctly', async () => {
      const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024)], 'large.bin');

      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [largeFile] },
      });

      await waitFor(() => {
        expect(screen.getByText(/5\.0 MB/)).toBeInTheDocument();
      });
    });

    it('should format time correctly', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        mockUpload.options.onProgress(100, 1000);
      });

      await waitFor(() => {
        // Should show time in seconds or minutes
        expect(screen.getByText(/ETA:/)).toBeInTheDocument();
      });
    });
  });

  describe('TUS Configuration', () => {
    it('should configure retry delays', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(tus.Upload).toHaveBeenCalledWith(
          mockFile,
          expect.objectContaining({
            retryDelays: [0, 1000, 3000, 5000, 10000],
          })
        );
      });
    });

    it('should configure chunk size', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(tus.Upload).toHaveBeenCalledWith(
          mockFile,
          expect.objectContaining({
            chunkSize: 1024 * 1024,
          })
        );
      });
    });

    it('should configure metadata', async () => {
      render(<TusDemo />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      await waitFor(() => {
        expect(tus.Upload).toHaveBeenCalledWith(
          mockFile,
          expect.objectContaining({
            metadata: {
              filename: 'test.txt',
              filetype: 'text/plain',
            },
          })
        );
      });
    });
  });
});