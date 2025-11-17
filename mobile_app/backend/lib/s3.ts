import { awsConfig, isDevelopment } from './aws-config';

interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
}

interface SignedUrlOptions {
  expiresIn?: number;
}

class MockS3 {
  private storage: Map<string, { content: Buffer | string; metadata: Record<string, any> }> = new Map();

  async upload(bucket: string, key: string, content: Buffer | string, options?: UploadOptions): Promise<string> {
    console.log('[S3] Mock uploading to:', { bucket, key });
    
    this.storage.set(`${bucket}/${key}`, {
      content,
      metadata: {
        contentType: options?.contentType || 'application/octet-stream',
        ...options?.metadata,
        uploadedAt: new Date().toISOString(),
      },
    });

    return `https://mock-s3.amazonaws.com/${bucket}/${key}`;
  }

  async download(bucket: string, key: string): Promise<Buffer | string> {
    console.log('[S3] Mock downloading from:', { bucket, key });
    
    const item = this.storage.get(`${bucket}/${key}`);
    if (!item) {
      throw new Error(`Object not found: ${bucket}/${key}`);
    }

    return item.content;
  }

  async delete(bucket: string, key: string): Promise<boolean> {
    console.log('[S3] Mock deleting:', { bucket, key });
    return this.storage.delete(`${bucket}/${key}`);
  }

  async listObjects(bucket: string, prefix?: string): Promise<string[]> {
    console.log('[S3] Mock listing objects:', { bucket, prefix });
    
    const keys: string[] = [];
    const searchKey = prefix ? `${bucket}/${prefix}` : `${bucket}/`;
    
    for (const key of this.storage.keys()) {
      if (key.startsWith(searchKey)) {
        keys.push(key.replace(`${bucket}/`, ''));
      }
    }

    return keys;
  }

  async getSignedUrl(bucket: string, key: string, options?: SignedUrlOptions): Promise<string> {
    console.log('[S3] Mock generating signed URL:', { bucket, key });
    
    const expiresIn = options?.expiresIn || 3600;
    const expires = Date.now() + (expiresIn * 1000);
    
    return `https://mock-s3.amazonaws.com/${bucket}/${key}?expires=${expires}&signature=mock-signature`;
  }

  async exists(bucket: string, key: string): Promise<boolean> {
    return this.storage.has(`${bucket}/${key}`);
  }

  async getMetadata(bucket: string, key: string): Promise<Record<string, any>> {
    const item = this.storage.get(`${bucket}/${key}`);
    if (!item) {
      throw new Error(`Object not found: ${bucket}/${key}`);
    }
    return item.metadata;
  }
}

class ProductionS3 {
  async upload(bucket: string, key: string, content: Buffer | string, options?: UploadOptions): Promise<string> {
    console.log('[S3] Uploading to AWS S3:', { bucket, key });
    throw new Error('AWS S3 not configured. Set AWS credentials to enable.');
  }

  async download(bucket: string, key: string): Promise<Buffer | string> {
    console.log('[S3] Downloading from AWS S3:', { bucket, key });
    throw new Error('AWS S3 not configured.');
  }

  async delete(bucket: string, key: string): Promise<boolean> {
    console.log('[S3] Deleting from AWS S3:', { bucket, key });
    throw new Error('AWS S3 not configured.');
  }

  async listObjects(bucket: string, prefix?: string): Promise<string[]> {
    console.log('[S3] Listing objects in AWS S3:', { bucket, prefix });
    throw new Error('AWS S3 not configured.');
  }

  async getSignedUrl(bucket: string, key: string, options?: SignedUrlOptions): Promise<string> {
    console.log('[S3] Generating signed URL for AWS S3:', { bucket, key });
    throw new Error('AWS S3 not configured.');
  }

  async exists(bucket: string, key: string): Promise<boolean> {
    console.log('[S3] Checking existence in AWS S3:', { bucket, key });
    throw new Error('AWS S3 not configured.');
  }

  async getMetadata(bucket: string, key: string): Promise<Record<string, any>> {
    console.log('[S3] Getting metadata from AWS S3:', { bucket, key });
    throw new Error('AWS S3 not configured.');
  }
}

export const s3 = isDevelopment ? new MockS3() : new ProductionS3();

export type { UploadOptions, SignedUrlOptions };
