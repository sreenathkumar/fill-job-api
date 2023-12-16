import express from 'express';
import { User } from '../models/userModels';
import { UserType } from '../utils/types';

export const getProfilesController = async (req: express.Request, res: express.Response) => {
   try {
      const { user_id } = req.query as { user_id: string };
      console.log(user_id);

      // if (!user_id) {
      //    res.send({ status: 'error', message: 'user_id not found' });
      //    return;
      // };
      const user = await User.find({});
      console.log(user);
      if (Object.keys(user).length === 0) {
         throw Error('user not found');
      };
      console.log('hello')
      //console.log(Object.keys(user).length);

   } catch (error) {
      //console.log(error);

      res.send({ status: 'error', message: error });
   }

};