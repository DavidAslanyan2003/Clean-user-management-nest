import { User } from "src/auth/domain/entities/user.entity";
import { Email } from "src/auth/domain/value-objects/email.value-object";

export interface IReadUserByEmailRepository {
  read(email: Email): Promise<User | undefined>
}
