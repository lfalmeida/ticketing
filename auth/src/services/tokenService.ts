import jwt from 'jsonwebtoken';
import { BadRequestError } from '@blackcoffee/common';
import { UserDoc, UserPayload } from '../interfaces/user';

export class TokenService {
  static generate(user: UserDoc) {
    return jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);
  }

  static verify(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    } catch (error) {
      throw new BadRequestError('Token invalid');
    }
  }
}