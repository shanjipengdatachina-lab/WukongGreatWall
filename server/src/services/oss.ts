import { config } from '../config';

export interface OSSConfig {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
  endpoint: string;
  secure: boolean;
}

export interface FileUploadResult {
  url: string;
  path: string;
  name: string;
}

export class OSSClient {
  private config: OSSConfig;
  private client: any;

  constructor() {
    this.config = {
      accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
      bucket: process.env.OSS_BUCKET || '',
      region: process.env.OSS_REGION || 'oss-cn-beijing',
      endpoint: process.env.OSS_ENDPOINT || '',
      secure: process.env.OSS_SECURE === 'true' || false
    };

    if (this.isConfigured()) {
      try {
        const OSS = require('ali-oss');
        this.client = new OSS(this.config);
      } catch (error) {
        console.warn('ali-oss not installed, falling back to local storage');
      }
    }
  }

  isConfigured(): boolean {
    return this.config.accessKeyId && this.config.accessKeySecret && this.config.bucket;
  }

  async uploadFile(filePath: string, originalName: string): Promise<FileUploadResult> {
    if (!this.client || !this.isConfigured()) {
      throw new Error('OSS not configured');
    }

    const fs = require('fs');
    const path = require('path');
    
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const ossPath = `uploads/${timestamp}_${random}${ext}`;

    const result = await this.client.put(ossPath, fs.createReadStream(filePath));

    return {
      url: result.url,
      path: ossPath,
      name: result.name
    };
  }

  async deleteFile(ossPath: string): Promise<void> {
    if (!this.client || !this.isConfigured()) {
      throw new Error('OSS not configured');
    }

    await this.client.delete(ossPath);
  }

  getFileUrl(ossPath: string): string {
    if (!this.isConfigured()) {
      throw new Error('OSS not configured');
    }

    if (this.client) {
      return this.client.signatureUrl(ossPath, { expires: 3600 });
    }

    const protocol = this.config.secure ? 'https' : 'http';
    return `${protocol}://${this.config.bucket}.${this.config.endpoint}/${ossPath}`;
  }
}

export const ossClient = new OSSClient();
