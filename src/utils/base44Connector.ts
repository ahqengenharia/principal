
import axios from 'axios';

interface Base44Config {
  apiKey?: string;
  appId: string;
}

class Base44Connector {
  private config: Base44Config;
  private baseUrl: string;

  constructor(config: Base44Config) {
    this.config = config;
    this.baseUrl = 'https://app.base44.com';
  }

  // Method to fetch data from the Base44 API
  async fetchAnnualReportData(entityId: string): Promise<any> {
    try {
      // Use our proxy to avoid CORS issues
      const response = await axios.post('/api/external/base44/proxy', {
        url: `${this.baseUrl}/api/entities/${entityId}`,
        payload: {
          appId: this.config.appId,
          apiKey: this.config.apiKey
        }
      });
      
      if (response.data.status === 200) {
        return response.data.data;
      } else {
        throw new Error(`Error fetching data: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Error connecting to Base44:', error);
      throw error;
    }
  }

  // Method to directly open Base44 dashboard
  openDashboard(): void {
    const dashboardUrl = `${this.baseUrl}/apps/${this.config.appId}/editor/preview/Dashboard`;
    window.open(dashboardUrl, '_blank');
  }

  // Method to check if Base44 is accessible
  async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get('/api/external/base44/status');
      return response.data.status === 'online';
    } catch (error) {
      console.error('Error checking Base44 connection:', error);
      return false;
    }
  }

  // Upload a template to Base44
  async uploadTemplate(templateContent: string | ArrayBuffer): Promise<any> {
    try {
      // Check content type
      const isArrayBuffer = templateContent instanceof ArrayBuffer;
      
      // Convert ArrayBuffer to base64 if needed
      let content = templateContent;
      if (isArrayBuffer) {
        content = this._arrayBufferToBase64(templateContent as ArrayBuffer);
      }
      
      // First try to upload to our backend
      try {
        const response = await axios.post('/api/external/base44/upload-template', {
          content: content,
          appId: this.config.appId,
          isBinary: isArrayBuffer
        });
        
        return response.data;
      } catch (apiError) {
        console.error('Error uploading to API, falling back to direct upload:', apiError);
        
        // Fallback to direct Base44 upload if backend fails
        const directResponse = await axios.post(`${this.baseUrl}/api/apps/${this.config.appId}/templates/upload`, {
          content: content,
          isBinary: isArrayBuffer,
          apiKey: this.config.apiKey
        });
        
        return directResponse.data;
      }
    } catch (error) {
      console.error('Error uploading template to Base44:', error);
      throw error;
    }
  }
  
  // Replace template variables
  async replaceTemplateVariables(templateId: string, variables: Record<string, string>): Promise<any> {
    try {
      const response = await axios.post('/api/external/base44/proxy', {
        url: `${this.baseUrl}/api/apps/${this.config.appId}/templates/${templateId}/variables`,
        payload: {
          variables,
          apiKey: this.config.apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error replacing template variables:', error);
      throw error;
    }
  }
  
  // Helper method to convert ArrayBuffer to base64
  private _arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return window.btoa(binary);
  }
}

export default Base44Connector;
