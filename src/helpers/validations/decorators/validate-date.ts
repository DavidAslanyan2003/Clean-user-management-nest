import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { ERROR_FILE_PATH } from '../../../helpers/constants/constants';

export function IsNotBeforeToday(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotBeforeToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          value = new Date(value);
          const today = new Date();
          return value >= today;
        },
        defaultMessage(args: ValidationArguments) {
          return `${ERROR_FILE_PATH}.IS_BEFORE_TODAY`;
        },
      },
    });
  };
}
