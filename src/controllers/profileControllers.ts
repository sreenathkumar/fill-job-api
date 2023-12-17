import express from 'express';
import { User } from '../models/userModels';
import ApplicationProfile from '../models/profileModels';


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

export const createProfileController = async (req: express.Request, res: express.Response) => {
   const profileData = req.body;

   if (!profileData) {
      res.send({ status: 'error', message: 'profile data not found' });
      return;
   };
   try {
      const createRes = await ApplicationProfile.create(profileData);
      res.send({ status: 'success', message: 'profile created successfully', data: createRes });
   } catch (error) {
      res.send({ status: 'error', message: error });
   }
};

export const updateProfileController = async (req: express.Request, res: express.Response) => {
   const profileData = req.body;

   if (!profileData) {
      res.send({ status: 'error', message: 'profile data not found' });
      return;
   };
   try {
      const updateRes = await ApplicationProfile.updateOne({ _id: profileData._id }, profileData);
      res.send({ status: 'success', message: 'profile updated successfully', data: updateRes });
   } catch (error) {
      res.send({ status: 'error', message: error });
   }
};

export const deleteProfileController = async (req: express.Request, res: express.Response) => {
   const profileId = req.query.profileId as string;
   if (!profileId) {
      res.send({ status: 'error', message: 'profile id not found' });
      return;
   }

   try {
      const deleteRes = await ApplicationProfile.deleteOne({ _id: profileId });
      res.send({ status: 'success', message: 'profile deleted successfully', data: deleteRes });
   } catch (error) {
      res.send({ status: 'error', message: error });
   }
}