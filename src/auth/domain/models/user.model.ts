import { UserStatus } from "../../presentation/enums/user-status.enum";
import { Email } from "../value-objects/email.value-object";

export class UserModel {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: Email;
  public password: string;
  public status: UserStatus;
  public created_at: Date;
  public updated_at: Date | null;

  constructor(
    firstName: string,
    lastName: string,
    email: Email,
    password: string,
    id?: string,
    status?: UserStatus,
    created_at?: Date,
    updated_at?: Date | null
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at
  }
 
}
