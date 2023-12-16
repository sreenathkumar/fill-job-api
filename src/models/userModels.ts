import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   profiles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'applicationProfile'
   }],
   type: {
      type: String,
      required: true
   },
});

export const User = mongoose.model('user', UserSchema);