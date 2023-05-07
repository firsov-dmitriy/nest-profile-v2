import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  public name: string;

  @Prop({ required: true, type: String })
  public email: string;

  @Prop({ required: true, type: String })
  public password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
