import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, now } from 'mongoose';
import * as bcrypt from 'bcrypt'

export type UserDocument = User & Document;

@Schema({
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.login_attempts;
        delete ret.login_attempts_date;
      },
    },
  })
export class User {
    @Prop({ required: true, trim: true, minlength: 2 })
    first_name: string;

    @Prop({ required: true, trim: true, minlength: 2 })
    last_name: string;

    @Prop({
      required: true, unique: true, trim: true, minlength: 4,
    })
    user_name: string;

    @Prop({
        required: true, unique: true, trim: true, minlength: 5,
    })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: true })
    active: boolean;

    @Prop({ default: 0 })
    login_attempts: number;

    @Prop({ type: Date, default: now() })
    login_attempts_date: string;
}
const schema = SchemaFactory.createForClass(User);
schema.pre('save', async function (next) {            
    const user = this
    if(!user.isModified('password')) {
      return next();
    }
    if(user.password) {
      user.password = await bcrypt.hash(user.password, 10);        
    }
});

export const UserSchema = schema;