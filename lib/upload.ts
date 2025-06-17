import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  thumbnailUrl?: string;
  duration?: number;
}

export class VideoUploadService {
  static async uploadVideo(file: File): Promise<UploadResult> {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload video to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'videos',
            quality: 'auto',
            format: 'mp4',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      // Generate thumbnail
      const thumbnailUrl = cloudinary.url(result.public_id, {
        resource_type: 'video',
        format: 'jpg',
        quality: 'auto',
        width: 640,
        height: 360,
        crop: 'fill',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        thumbnailUrl,
        duration: result.duration,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  static async deleteVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video',
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  static getThumbnailUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'jpg',
      quality: 'auto',
      width: 640,
      height: 360,
      crop: 'fill',
    });
  }
}
