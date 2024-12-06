import { Email } from "src/auth/domain/value-objects/email.value-object";

export class GetUserByEmailQuery {
  constructor(public readonly email: Email) {}
}
