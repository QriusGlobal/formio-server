/**
 * Form.io REST API Helper Functions
 *
 * Provides TypeScript interfaces for programmatic Form.io interactions:
 * - Authentication and session management
 * - Project and form creation
 * - Form submission
 * - File upload handling
 *
 * Usage:
 *   const api = new FormioAPI();
 *   await api.login('admin@example.com', 'password');
 *   const form = await api.createForm(formDefinition);
 *   const submission = await api.submitForm(formId, data);
 */

import * as path from 'node:path';

import axios, { type AxiosInstance, AxiosRequestConfig } from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

/**
 * Authentication response from Form.io
 */
export interface FormioAuth {
  token: string;
  user: {
    _id: string;
    email: string;
    data?: Record<string, any>;
    roles?: string[];
  };
}

/**
 * Form.io project definition
 */
export interface FormioProject {
  _id?: string;
  title: string;
  name: string;
  description?: string;
  created?: string;
  modified?: string;
}

/**
 * Form.io form component
 */
export interface FormioComponent {
  type: string;
  key: string;
  label: string;
  input?: boolean;
  storage?: string;
  url?: string;
  options?: Record<string, any>;
  validate?: {
    required?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Form.io form definition
 */
export interface FormioForm {
  _id?: string;
  title: string;
  name: string;
  path: string;
  type?: string;
  display?: string;
  tags?: string[];
  components: FormioComponent[];
  created?: string;
  modified?: string;
}

/**
 * Form.io submission data
 */
export interface FormioSubmission {
  _id?: string;
  form?: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
  created?: string;
  modified?: string;
  state?: string;
}

/**
 * Form.io API client configuration
 */
export interface FormioAPIConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Main Form.io API Client
 *
 * Handles all REST API interactions with Form.io server
 */
export class FormioAPI {
  private baseURL: string;
  private token: string | null = null;
  private client: AxiosInstance;

  /**
   * Initialize Form.io API client
   * @param config - Optional configuration overrides
   */
  constructor(config?: FormioAPIConfig) {
    this.baseURL = config?.baseURL || process.env.FORMIO_BASE_URL || 'http://localhost:3001';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: config?.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Form.io API Error: ${message}`);
      }
    );
  }

  /**
   * Authenticate with Form.io server
   * @param email - User email
   * @param password - User password
   * @returns Authentication result with token and user data
   */
  async login(email: string, password: string): Promise<FormioAuth> {
    try {
      const response = await this.client.post('/user/login', {
        data: { email, password }
      });

      // Extract token from various possible locations
      this.token = response.data.token ||
                   response.data['x-jwt-token'] ||
                   response.headers['x-jwt-token'];

      if (!this.token) {
        throw new Error('No JWT token received from login response');
      }

      // Update client defaults to include token
      this.client.defaults.headers.common['x-jwt-token'] = this.token;

      return {
        token: this.token,
        user: response.data.user || response.data.data || {}
      };
    } catch (error) {
      // Try alternative admin login endpoint
      try {
        const response = await this.client.post('/admin/login', {
          data: { email, password }
        });

        this.token = response.data.token || response.data['x-jwt-token'];
        if (this.token) {
          this.client.defaults.headers.common['x-jwt-token'] = this.token;
          return { token: this.token, user: response.data.user || {} };
        }
      } catch {
        // Fall through to throw original error
      }

      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new Form.io project
   * @param project - Project definition
   * @returns Created project data
   */
  async createProject(project: FormioProject): Promise<FormioProject> {
    this.ensureAuthenticated();

    const response = await this.client.post('/project', project);
    return response.data;
  }

  /**
   * Create a new form
   * @param formDef - Form definition with components
   * @returns Created form data
   */
  async createForm(formDef: FormioForm): Promise<FormioForm> {
    this.ensureAuthenticated();

    const response = await this.client.post('/form', formDef);
    return response.data;
  }

  /**
   * Get form definition by ID
   * @param formId - Form identifier
   * @returns Form definition
   */
  async getForm(formId: string): Promise<FormioForm> {
    const response = await this.client.get(`/form/${formId}`);
    return response.data;
  }

  /**
   * Submit data to a form
   * @param formId - Form identifier
   * @param data - Submission data
   * @returns Created submission
   */
  async submitForm(formId: string, data: Record<string, any>): Promise<FormioSubmission> {
    this.ensureAuthenticated();

    const response = await this.client.post(
      `/form/${formId}/submission`,
      { data }
    );
    return response.data;
  }

  /**
   * Get submission by ID
   * @param submissionId - Submission identifier
   * @returns Submission data
   */
  async getSubmission(submissionId: string): Promise<FormioSubmission> {
    this.ensureAuthenticated();

    const response = await this.client.get(`/submission/${submissionId}`);
    return response.data;
  }

  /**
   * List submissions for a form
   * @param formId - Form identifier
   * @param params - Query parameters (limit, skip, sort, etc.)
   * @returns Array of submissions
   */
  async listSubmissions(
    formId: string,
    params?: Record<string, any>
  ): Promise<FormioSubmission[]> {
    this.ensureAuthenticated();

    const response = await this.client.get(`/form/${formId}/submission`, {
      params
    });
    return response.data;
  }

  /**
   * Delete a form
   * @param formId - Form identifier
   */
  async deleteForm(formId: string): Promise<void> {
    this.ensureAuthenticated();
    await this.client.delete(`/form/${formId}`);
  }

  /**
   * Delete a submission
   * @param submissionId - Submission identifier
   */
  async deleteSubmission(submissionId: string): Promise<void> {
    this.ensureAuthenticated();
    await this.client.delete(`/submission/${submissionId}`);
  }

  /**
   * Health check endpoint
   * @returns Server health status
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      // Try alternative root endpoint
      try {
        const response = await this.client.get('/');
        return response.status === 200;
      } catch {
        return false;
      }
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Set authentication token manually
   * @param token - JWT token
   */
  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['x-jwt-token'] = token;
  }

  /**
   * Clear authentication
   */
  logout(): void {
    this.token = null;
    delete this.client.defaults.headers.common['x-jwt-token'];
  }

  /**
   * Ensure client is authenticated before making requests
   * @throws Error if not authenticated
   */
  private ensureAuthenticated(): void {
    if (!this.token) {
      throw new Error('Not authenticated. Call login() first.');
    }
  }
}

/**
 * Helper function to create a standard file upload form
 * @param tusEndpoint - TUS upload endpoint URL
 * @returns Form definition ready for creation
 */
export function createFileUploadForm(
  tusEndpoint: string = process.env.TUS_ENDPOINT || 'http://localhost:1080/files/'
): FormioForm {
  return {
    title: 'File Upload Test Form',
    name: 'fileuploadtest',
    path: 'fileuploadtest',
    type: 'form',
    display: 'form',
    tags: ['test', 'upload', 'automated'],
    components: [
      {
        type: 'textfield',
        key: 'title',
        label: 'Title',
        placeholder: 'Enter a title',
        input: true,
        validate: {
          required: true,
          minLength: 3,
          maxLength: 100
        }
      },
      {
        type: 'file',
        key: 'attachment',
        label: 'Upload File',
        storage: 'url',
        url: tusEndpoint,
        options: {
          withCredentials: false
        },
        filePattern: '*',
        fileMinSize: '0KB',
        fileMaxSize: '100MB',
        uploadOnly: false,
        input: true,
        validate: {
          required: true
        }
      },
      {
        type: 'textarea',
        key: 'description',
        label: 'Description',
        placeholder: 'Optional description',
        rows: 3,
        input: true
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit',
        theme: 'primary',
        disableOnInvalid: true
      }
    ]
  };
}

/**
 * Load Form.io configuration from environment
 */
export function loadFormioConfig(): {
  baseURL: string;
  token?: string;
  formId?: string;
  projectId?: string;
} {
  return {
    baseURL: process.env.FORMIO_BASE_URL || 'http://localhost:3001',
    token: process.env.FORMIO_JWT_TOKEN,
    formId: process.env.FORMIO_FORM_ID,
    projectId: process.env.FORMIO_PROJECT_ID,
  };
}
