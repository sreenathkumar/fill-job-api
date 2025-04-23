import mongoose from "mongoose";

export interface ApiResponse<T = any> {
   status: number,
   message: string,
   data?: T,
   errors: string[],
}

export interface UserType {
   id: string,
   name: string | null | undefined,
   username: string,
   image: string | null | undefined,
   profiles: mongoose.Types.ObjectId[] | null | undefined,
   type: string | null | undefined,
}

export interface ProfileDataType {
   _id: string,
   data: object,
   email: string
}


export type duration =
   | number
   | `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`
