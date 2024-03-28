import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    return value;
  }

  private toValidate(metatype: unknown): boolean {
    return typeof metatype === 'function' && metatype !== Function;
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
