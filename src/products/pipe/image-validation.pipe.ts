import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]) {
    const MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize: number = 1 * 1024 * 1024;

    files.forEach(({ mimetype, size }) => {
      if (!MIME_TYPES.includes(mimetype)) {
        throw new BadRequestException(
          'The image should be either jpeg, png, or webp.',
        );
      }
      if (size > maxSize) {
        throw new BadRequestException(
          `File size should not exceed ${maxSize / (1024 * 1024)} MB.`,
        );
      }
    });
    return files;
  }
}
