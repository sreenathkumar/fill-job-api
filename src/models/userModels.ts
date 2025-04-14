import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: false
   },
   profiles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'applicationProfile'
   }],
   type: {
      type: String,
      required: false
   },
});

UserSchema.plugin(passportLocalMongoose); // using passport-local-mongoose as a plugin for hashing the password ans saving it in the database
const User = mongoose.model('user', UserSchema);

export default User