import mongoose, { CallbackError } from "mongoose";
import { hash } from "../utils/hashing";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
      default: () => [], // new array for every user
    },
  ],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await hash(this.password);
    return next();
  } catch (e) {
    return next(e as CallbackError);
  }
});

export const User = mongoose.model("User", UserSchema);
