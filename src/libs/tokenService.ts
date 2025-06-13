import jwt from 'jsonwebtoken';
import config from 'config';

class TokenService {
  private readonly secret: string;

  private readonly expiresIn: string | number;

  constructor() {
    this.secret = config.get<string>('auth.jwtSecret');
    this.expiresIn = config.get<string>('auth.jwtExpiresIn') || '1h';
  }

  // Generate token
  // public generateToken(payload: object, exp?: number): string {
  public generateToken(payload: object): string {
    const options: jwt.SignOptions = {};
    options.expiresIn = this.expiresIn as jwt.SignOptions['expiresIn'];
    return jwt.sign(payload, this.secret, options);
  }

  // Check
  public verifyToken(token: string): object | string {
    try {
      return jwt.verify(token, this.secret);
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  // Decode
  public decodeToken(token: string): null | { [key: string]: any } | string {
    return jwt.decode(token);
  }
}

export default new TokenService();
