import * as express from 'express';
import User from '@models/userModels';
import passport from 'passport';

//controller for handling signup
export const signupController = async (req: express.Request, res: express.Response) => {
   const userData = req.body;
   console.log(userData);

   if (!userData) {
      res.send({ status: 'error', message: 'user data not found' });
      return;
   };
   try {
      const createRes = await User.register({ username: userData.username }, userData.password);
      res.send({ status: 'success', message: 'user created successfully', data: createRes });
   } catch (error) {
      res.send({ status: 'error', message: error });
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