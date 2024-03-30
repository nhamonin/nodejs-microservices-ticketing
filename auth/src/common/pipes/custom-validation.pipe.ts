import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { ValidationError as CustomValidationError } from '../errors/ValidationError';

@Injectable()
export class CustomValidationPipe<T> implements PipeTransform<T, Promise<T>> {
  async transform(value: T, { metatype }: ArgumentMetadata): Promise<T> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (this.isClass(metatype)) {
      const object = plainToClass(metatype as Type<any>, value);
      const errors = await validate(object);
      if (errors.length > 0) {
        throw new CustomValidationError(this.formatErrors(errors));
      }
    }

    return value;
  }

  private toValidate(metatype: unknown): boolean {
    return this.isClass(metatype);
  }

  private isClass(
    metatype: unknown,
  ): metatype is new (...args: any[]) => unknown {
    return typeof metatype === 'function' && metatype.prototype;
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      const constraints = err.constraints
        ? Object.values(err.constraints).map((message) => ({
            field: err.property,
            message,
          }))
        : [];
      return [...acc, ...constraints];
    }, []);
  }
}
