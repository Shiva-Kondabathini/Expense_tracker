import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model("User", userSchema);
