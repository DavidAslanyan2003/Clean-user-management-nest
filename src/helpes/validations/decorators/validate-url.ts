import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { I18nContext } from 'nestjs-i18n';

@ValidatorConstraint({ async: false })
export class IsValidPath implements ValidatorConstraintInterface {
  validate(url: string, args: ValidationArguments): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const i18nContext = I18nContext.current();
    return i18nContext.t('error.invalidURL', {
      lang: i18nContext.lang,
      args: { property: args.property },
    });
  }
}

export function IsValidUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPath,
    });
  };
}
