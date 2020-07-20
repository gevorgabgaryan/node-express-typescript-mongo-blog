import { NumerusError } from "../shared/errors";
import  { Schema, Model, Document, Types, model } from "mongoose";
import Env from "../../env";
const Objectid = Types.ObjectId;

export type SessionDocument = Document & {
  userId: string;
  tfa: string;
  token: string;
  endDate: Date;
  role: string;
  closed: boolean;
  hasPassword: boolean;
  isAgreeWithTerms: boolean;
  getByToken(): string;
};

interface ISessionModel extends Model<SessionDocument> {
  getByToken: (token: string) => Promise<SessionDocument>;
}


const SessionsSchema = new Schema({
  userId: { type: Objectid, index: true },
  tfa: {
    type: String,
    enum: ["disabled", "needToCheck", "success", "mobile"],
    default: "disabled",
  },
  token: String,
  endDate: Date,
  role: { type: String, enum: Env.roles },
  closed: { type: Boolean, default: false },
  hasPassword: { type: Boolean, default: false },
  isAgreeWithTerms: { type: Boolean, default: false },
});

SessionsSchema.statics.getByUserId = async function (userId: any) {
  const query = {
    userId: userId,
  };

  try {
    await this.findOne(query);
  } catch (err) {
    throw new NumerusError("Failed to connect to db", "ERROR_DB");
  }
}
  SessionsSchema.statics.getByToken = async function (token: string) {
    const query = {
      token,
    };
  
    try {
      await this.findOne(query);
    } catch (err) {
      throw new NumerusError("Failed to connect to db", "ERROR_DB");
    }
  }
  SessionsSchema.statics.removeByUserId = async function (
    userId: any,
    beforeDate: any
  ): Promise<any> {
    try {
      const query: {
        userId: any;
        endDate?: any;
      } = { userId: userId };
      if (beforeDate) {
        query.endDate = { $lt: beforeDate };
      }
       await this.updateMany(query, { closed: true });
    } catch (err: any) {
      throw new NumerusError("Failed to connect to db", "ERROR_DB");
    }
  };

export const Session = model<SessionDocument,ISessionModel>(
  "session",
  SessionsSchema
);


