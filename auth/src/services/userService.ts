import { BadRequestError } from '../errors/badRequestError';
import { UserAttrs } from '../interfaces/user';
import { User } from '../models/user';
import { PasswordService } from './passwordService';

export class UserService {

  static async create(attrs: UserAttrs) {
    const existingUser = await User.findOne({ email: attrs.email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const user = User.build(attrs);
    await user.save();
    return user;
  }

  static async validateCredentials(email: string, password: string) {
    const errorMessage = 'Invalid Credentials';
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError(errorMessage);
    }

    const passwordsMatch = await PasswordService.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError(errorMessage);
    }
    return existingUser;
  }

}