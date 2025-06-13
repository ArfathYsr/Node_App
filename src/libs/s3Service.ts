import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import config from 'config';
import ContentLoadingError from '../error/сontentLoadingError';

type UploadImageParams = {
  key: string;
  body: Buffer | Uint8Array | Blob | string | Readable;
  contentType: string;
};

type GetImageParams = {
  key: string;
};

type DeleteImageParams = {
  key: string;
};

export class S3Service {
  private readonly s3Client: S3Client;

  private readonly bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: config.get<string>('aws.region'),
      credentials: {
        accessKeyId: config.get<string>('aws.awsAccessKey'),
        secretAccessKey: config.get<string>('aws.awsSecretKey'),
      },
    });
    this.bucketName = config.get<string>('aws.s3BucketName');
  }

  async uploadImage({
    key,
    body,
    contentType,
  }: UploadImageParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read',
      Expires: new Date(),
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
      throw new ContentLoadingError(
        `S3 Error upload image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getImage({ key }: GetImageParams): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const { Body } = await this.s3Client.send(command);
      if (Body instanceof Readable) {
        return Body;
      }
      throw new Error('Unexpected response body type');
    } catch (error) {
      throw new ContentLoadingError(
        `S3 Error getting image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteImage({ key }: DeleteImageParams): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      throw new ContentLoadingError(
        `S3 Error deleting image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async doesImageExist(key: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }
}
