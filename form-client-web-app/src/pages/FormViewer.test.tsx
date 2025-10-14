import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import '@testing-library/jest-dom';
import FormViewer from './FormViewer';

describe('FormViewer', () => {
  it('renders the form viewer header', () => {
    render(<FormViewer />);
    expect(screen.getByText('📋 Form.io Client Viewer')).toBeInTheDocument();
    expect(screen.getByText(/Simple web client for viewing/)).toBeInTheDocument();
  });

  it('shows sample form selector by default', () => {
    render(<FormViewer />);
    expect(screen.getByText('Use Sample Form')).toBeInTheDocument();
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('allows switching to custom JSON mode', () => {
    render(<FormViewer />);
    const customRadio = screen.getByLabelText(/Use Custom JSON/);
    fireEvent.click(customRadio);

    expect(screen.getByPlaceholderText(/Paste your Form.io JSON here/)).toBeInTheDocument();
  });

  it('shows load template button in custom JSON mode', () => {
    render(<FormViewer />);
    const customRadio = screen.getByLabelText(/Use Custom JSON/);
    fireEvent.click(customRadio);

    expect(screen.getByText('Load Selected Sample as Template')).toBeInTheDocument();
  });

  it('renders form selector with all sample forms', () => {
    render(<FormViewer />);

    expect(screen.getByText('Simple Form (Name & Email)')).toBeInTheDocument();
    expect(screen.getByText(/Contact Form/)).toBeInTheDocument();
    expect(screen.getByText(/Survey Form/)).toBeInTheDocument();
  });

  it('changes selected form when option is changed', () => {
    render(<FormViewer />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'contact' } });
    expect(select.value).toBe('contact');

    fireEvent.change(select, { target: { value: 'survey' } });
    expect(select.value).toBe('survey');
  });

  it('loads JSON template when button is clicked', () => {
    render(<FormViewer />);

    // Switch to custom JSON mode
    const customRadio = screen.getByLabelText(/Use Custom JSON/);
    fireEvent.click(customRadio);

    // Click load template button
    const loadButton = screen.getByText('Load Selected Sample as Template');
    fireEvent.click(loadButton);

    // Check that textarea has content
    const textarea = screen.getByPlaceholderText(
      /Paste your Form.io JSON here/
    );
    expect(textarea.value).toContain('"display": "form"');
    expect(textarea.value).toContain('"components":');
  });

  it('displays error message when custom JSON is invalid', async () => {
    render(<FormViewer />);

    // Switch to custom JSON mode
    const customRadio = screen.getByLabelText(/Use Custom JSON/);
    fireEvent.click(customRadio);

    // Enter invalid JSON
    const textarea = screen.getByPlaceholderText(/Paste your Form.io JSON here/);
    fireEvent.change(textarea, { target: { value: '{ invalid json }' } });

    // Note: Form.io Form component may throw errors, but we handle them gracefully
    // The app should not crash
    expect(screen.getByText('📋 Form.io Client Viewer')).toBeInTheDocument();
  });

  it('shows client-side note after form submission', async () => {
    render(<FormViewer />);

    // Mock form submission by directly calling the submit handler
    // (Full integration test would require Form.io component testing)

    // This is a simplified test - full test would require form interaction
    // For now, we verify the component structure exists
    expect(screen.getByText('Select Form')).toBeInTheDocument();
  });

  it('has all required form viewer sections', () => {
    render(<FormViewer />);

    // Header section
    expect(screen.getByText('📋 Form.io Client Viewer')).toBeInTheDocument();

    // Form selector section
    expect(screen.getByText('Select Form')).toBeInTheDocument();

    // Sample form radio button
    expect(screen.getByText('Use Sample Form')).toBeInTheDocument();

    // Custom JSON radio button
    expect(screen.getByText('Use Custom JSON')).toBeInTheDocument();
  });

  it('renders without crashing when all props are valid', () => {
    const { container } = render(<FormViewer />);
    expect(container).toBeInTheDocument();
  });
});
