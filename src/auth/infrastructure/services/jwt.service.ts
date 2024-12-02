import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/user.entity';
import { IJwtService } from '../interfaces/jwt-service.interface';

export class JwtService implements IJwtService {
  private readonly secret: string;
  private readonly expiresIn: string = '1h'; 

  constructor() {
    this.secret = process.env.JWT_SECRET || 'my-default-secret-key';
  }

  public generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
