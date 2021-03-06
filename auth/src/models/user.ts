import mongoose from 'mongoose';

import { UserAttrs, UserDoc, UserModel } from '../interfaces/user';
import { PasswordService } from '../services/passwordService';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

// using "function" keyword maintain the "this" keyword
// attached to the document context, instead of the entire file
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordService.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { User };