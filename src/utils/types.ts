import mongoose from "mongoose";

export interface UserType extends Document {
   name: string,
   email: string,
   profiles: mongoose.Schema.Types.ObjectId[],
   type: string
}

export interface ProfileDataType {
   _id: string,
   data: object,
   email: string
}