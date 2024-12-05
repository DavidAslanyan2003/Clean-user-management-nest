import { User } from "../../domain/entities/user.entity";

export interface IJwtService {
  generateToken(id: string): string;
  verifyToken(token: string): any;
}
