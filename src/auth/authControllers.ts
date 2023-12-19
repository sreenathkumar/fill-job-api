import * as express from 'express';
import { User } from '../models/userModels';

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

export const loginController = async (req: express.Request, res: express.Response) => {

   res.send({ status: 'success', message: 'user logged in successfully', });

}