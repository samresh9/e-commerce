import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { TestDto } from './dto/test.dto';

@Injectable()
export class ToNumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): TestDto {
    // if files then return
    if (metadata.type === 'custom') return value;

    const { number, ...rest } = value;

    const val = parseInt(number);
    if (isNaN(val)) {
      throw new NotFoundException('no');
    }
    return { ...rest, number: val };
  }
}
