import * as jwt from 'jsonwebtoken';
import { IJwtService } from '../interfaces/jwt-service.interface';

export class JwtService implements IJwtService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'my-default-secret-key';
  }

  public generateToken(userId: string): string {
    return jwt.sign(userId, this.secret);
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
