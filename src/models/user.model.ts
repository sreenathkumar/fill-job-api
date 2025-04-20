import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
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

//hash the password before saving the password
UserSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
      next();
   }

   const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND) || 12); // default 12
   this.password = await bcrypt.hash(this.password, salt);
   next();
})

const User = mongoose.model('user', UserSchema);

export default User