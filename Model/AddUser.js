import { ConnectMongodb } from "../src/utils/ConnectMongodb";
import bcrypt from 'bcrypt';
import { model, models, Schema } from "mongoose";
const addUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true 
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  DOB: {
    type: String,
    required: true
  }
});
addUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});
addUserSchema.methods.comparePassword = async function (plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password);
};
const addUserModel = models.Users || model('Users', addUserSchema);

export default addUserModel;
