import jwt from 'jsonwebtoken';
import { UserDoc } from '../interfaces/user';

export class TokenService {
  static generate(user: UserDoc) {
    return jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);
  }
}