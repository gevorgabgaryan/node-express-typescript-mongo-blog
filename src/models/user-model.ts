
import {NumerusError} from '../shared/errors';
import {model, Schema, Model, Document} from 'mongoose';


export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBlocked: string;
  role: string;
  lang: string;
  status: string,
  verifyCode: number,
  verifyCodeDate: Date
}

export interface IUserModel extends Model<IUserDocument> {
  getByVerifyCode: (code: number) => Promise<IUserDocument>;
}

type UserInput = {
  firstName: IUserDocument['firstName'];
  lastName: IUserDocument['lastName'];
  email: IUserDocument['email'];
  password: IUserDocument['password'];
  isBlocked: IUserDocument['isBlocked'];
  role: IUserDocument['role'];
  status: IUserDocument['status']
  lang: IUserDocument['lang']
  verifyCode: IUserDocument['verifyCode']
  verifyCodeDate: IUserDocument['verifyCodeDate']
};

const UsersSchema = new Schema(
  {
    firstName: {
      type: Schema.Types.String,
    },
    lastName: {
      type: Schema.Types.String,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
    },
    isBlocked: {
      type: Schema.Types.Boolean,
      default: false,
    },
    role: {
      type: Schema.Types.String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    lang: {
      type: Schema.Types.String,
      default: 'en',
      enum: ['en', 'ru', 'hy'],
    },
    status: {
      type: Schema.Types.String,
      enum: ['new', 'active', 'inactive']
    },
    verifyCode: {
      type: Number,
      unique: true
    },
    verifyCodeDate: {
      type: Date
    }
  },
  {
    collection: 'users',
    timestamps: true,
  },

);


UsersSchema.statics.getByVerifyCode = async function (verifyCode: string) {
  const query = {
    verifyCode,
  };

  try {
    return await this.findOne(query).select('-password').exec();
  } catch (err) {
    throw new NumerusError("Failed to connect to db", "ERROR_DB");
  }
}

export const User = model<IUserDocument, IUserModel>('User', UsersSchema);



