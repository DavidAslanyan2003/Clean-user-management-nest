import { User } from "../../domain/entities/user.entity";

export interface IJwtService {
  generateToken(user: User): string;
  verifyToken(token: string): any;
}
