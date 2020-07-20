
import {NumerusError} from '../shared/errors';
import {model, Schema, Model, Document} from 'mongoose';



export interface ISettingDocument extends Document {
    name: string,
    value: string,
    createdAt: Date
}

export interface ISettingModel extends Model<ISettingDocument> {
    get: (name: any, value: any) => Promise<ISettingDocument>;
    set: (name: any, value: any) => Promise<ISettingDocument>;
}


const SettingsSchema = new Schema(
  {
    name: String,
    value: String
  },
  {
    collection: 'settings',
    timestamps: true,
  },

);




SettingsSchema.statics.get = async function(name, def) {
    const Setting = await this.findOne({
        name: name
    });

    if (!Setting) {
        if (def !== undefined) {
            SettingsSchema.set(name, def);
            return def;
        } else {
            return null;
        }
    } else {
        return Setting.value;
    }
};

SettingsSchema.statics.set = async function(name: any, value: any) {
    const Setting = await this.findOne({
        name: name
    });

    if (Setting) {
        Setting.value = value;
        await Setting.save();
        return;
    }

    const newSetting = new this();

    newSetting.name = name;
    newSetting.value = value;
    await newSetting.save();
};

export const Setting = model<ISettingDocument, ISettingModel>('Setting', SettingsSchema);