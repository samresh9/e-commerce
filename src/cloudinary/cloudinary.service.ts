import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
// import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(files: Express.Multer.File[]): Promise<any>[] {
    const promises = files.map((file) => {
      return new Promise<UploadApiErrorResponse | any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) return reject(error);
            if (result) resolve(result.url);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });
    return promises;
  }
}
