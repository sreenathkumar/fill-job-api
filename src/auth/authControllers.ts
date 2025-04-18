import * as express from 'express';
import User from '@models/userModels';
import passport from 'passport';
import { sendError, sendSuccess } from '@/utils/response';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import mongoose from 'mongoose';
import Token from '@/models/tokenModel';
import { duration } from '@/utils/types';
import { convertToMili } from '@/utils/others';

//controller for handling signup
export const signupController = async (req: express.Request, res: express.Response) => {
   const userData = req.body;
   console.log(userData);

   if (!userData) {
      sendError(res, 'Error in registering users', 400, ['user data not found']);
   };
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      const registeredUser = await User.register({ username: userData.username }, userData.password);
      if (registeredUser) {
         await registeredUser.save(session);

         const accessToken = generateAccessToken(registeredUser._id, process.env.SESSION_EXPIRE as duration);
         const refreshToken = generateAccessToken(registeredUser._id, process.env.SESSION_EXPIRE as duration);

         if (accessToken && refreshToken) {
            //create the token
            const token = new Token({
               user: registeredUser._id,
               refreshToken: refreshToken,
               expiresAt: new Date(Date.now() + convertToMili(process.env.SESSION_EXPIRE)) //3days
            });

            //save on the DB
            await token.save(session);

            //finish the transaction
            await session.commitTransaction();
            session.endSession();

            //set accesstoken to the cookie
            res.cookie('accessToken', accessToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: 'strict',
               maxAge: 15 * 60 * 1000 //15min
            });

            //set refreshToken to  cookie
            res.cookie('refreshToken', refreshToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: 'strict',
               maxAge: convertToMili(process.env.SESSION_EXPIRE) //3d
            });
            sendSuccess(res, registeredUser, 'user created successfully');
         } else {
            sendError(res, 'Error in generating tokens', 500, ['No accessToken or refreshToken is generated']);
         }

      } else {
         sendError(res, 'Error in registering users', 400, ["the user registration failed because of DB error"]);
      }

   } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      sendError(res, 'Unexpected error.', 500, [error?.message])
   }
};

//controller for handling login
export const loginController = async (req: express.Request, res: express.Response) => {
   if (!req.body.username) {
      res.send({ status: 'error', message: 'Username is required' })
      return;
   }
   if (!req.body.password) {
      res.send({ status: 'error', message: 'Password is required' });
      return;
   }

   try {
      passport.authenticate('local', (err: any, user: any, info: any) => {
         if (err) {
            throw Error(err);
         }
         if (!user) {
            res.send({ status: 'error', message: 'username or password is incorrect' });
            return;
         }
         console.log(user);

         req.logIn(user, (err) => {
            if (err) {
               throw Error(err);
            }
            res.send({ status: 'success', message: 'logged in successfully' });
         });
      })
   } catch (error) {
      res.send({ status: 'error', message: error });
   }

}

//controller for handling logout
export const logoutController = async (req: express.Request, res: express.Response) => {
   //do something
   res.send({ status: 'success', message: 'logged out successfully' });
}