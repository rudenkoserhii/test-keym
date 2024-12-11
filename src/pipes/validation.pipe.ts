import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { ValidationException } from 'exceptions/validation.exception';

const ARRAY_DELIMITER = ', ';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {
        return `${err.property} - ${Object.values(err.constraints).join(ARRAY_DELIMITER)}`;
      });
      throw new ValidationException(messages);
    }
    return value;
  }
}
