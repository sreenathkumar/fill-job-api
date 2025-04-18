import mongoose from "mongoose";

export interface ApiResponse<T = any> {
   status: number,
   message: string,
   data?: T,
   errors: string[],
}

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


export type duration =
   | number
   | `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`
