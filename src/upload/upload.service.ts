import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    // configure cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // ─── UPLOAD SINGLE IMAGE ─────────────────────
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'hotel-booking',
  ): Promise<string> {
    if (!file) throw new BadRequestException('No file provided');

    // only allow images
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only jpeg, png and webp files are allowed',
      );
    }

    // max 5mb
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be under 5MB');
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,                    // organise by folder
            resource_type: 'image',
            transformation: [
              { width: 1200, crop: 'limit' },  // max width 1200px
              { quality: 'auto' },              // auto compress
              { fetch_format: 'auto' },         // auto format (webp if supported)
            ],
          },
          (error, result) => {
             if (error || !result?.secure_url) {
            return reject(
            new BadRequestException(error?.message ?? 'Image upload failed'),
          );
        }

        return resolve(result.secure_url);
          },
        )
        .end(file.buffer); // send file buffer to cloudinary
    });
  }

  // ─── UPLOAD MULTIPLE IMAGES ──────────────────
  async uploadImages(
    files: Express.Multer.File[],
    folder: string = 'hotel-booking',
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 images allowed');
    }

    // upload all images in parallel
    const urls = await Promise.all(
      files.map((file) => this.uploadImage(file, folder)),
    );

    return urls;
  }

  // ─── DELETE IMAGE ────────────────────────────
  async deleteImage(imageUrl: string): Promise<void> {
    // extract public id from url
    // url looks like: https://res.cloudinary.com/cloud/image/upload/v123/folder/filename.jpg
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename}`;

    await cloudinary.uploader.destroy(publicId);
  }
}