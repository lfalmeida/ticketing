import { BadRequestError } from '../errors/badRequestError';
import { UserAttrs } from '../interfaces/user';
import { User } from '../models/user';

export class UserService {

  async create(attrs: UserAttrs) {
    const existingUser = await User.findOne({ email: attrs.email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const user = User.build(attrs);
    await user.save();
    return User.build(attrs);
  }
}