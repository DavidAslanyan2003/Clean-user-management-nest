import { Email } from "../../../../domain/value-objects/email.value-object";

export interface ReadUserResultDto {
  id: string,
  firstName: string,
  lastName: string,
  created_at: Date,
  updated_at: Date | null | undefined,
  email: string | Email
}
