import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ERROR_FILE_PATH } from '../../../helpers/constants/constants';

@ValidatorConstraint({ async: false })
export class IsValidPathArray implements ValidatorConstraintInterface {
  validate(urls: string[], args: ValidationArguments): boolean {
    try {
      urls.forEach((url) => new URL(url));

      return true;
    } catch (_) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${ERROR_FILE_PATH}.INVALID_URL`;
  }
}

export function IsValidUrlArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPathArray,
    });
  };
}
