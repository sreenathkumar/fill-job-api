import express from "express";
import { User } from "../models/userModels";
import ApplicationProfile from "../models/profileModels";
import dbDataMap from "../utils/dbDataMap.json";

// =========================================================
// Controller for getting profiles
// =========================================================
export const getProfilesController = async (
   req: express.Request,
   res: express.Response
) => {
   try {
      const { user_id } = req.query as { user_id: string };

      // if (!user_id) {
      //    res.send({ status: 'error', message: 'user_id not found' });
      //    return;
      // };
      const user = await User.find({});
      if (Object.keys(user).length === 0) {
         throw Error("user not found");
      }
      //console.log(Object.keys(user).length);
   } catch (error) {
      //console.log(error);

      res.send({ status: "error", message: error });
   }
};

// =========================================================
// Controller for creating profile
// =========================================================
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

// =========================================================
// Controller for updating profile
// =========================================================
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

// =========================================================
// Controller for deleting profile
// =========================================================
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

// =========================================================
// Controller for getting job data
// =========================================================
export const getJobDataController = async (
   req: express.Request,
   res: express.Response
) => {

   try {
      //get data form database
      const dbData = await ApplicationProfile.findOne({ email: 'gofranhossent20@gmail.com' }).lean();

      if (!dbData) {
         throw new Error("Data not found");
      }

      const { matchedData, notFoundKeys } = getSearchedData(dbData, req.body.data);

      //const aiResponse = await getGroqChatCompletion();
      //const data = aiResponse?.choices[0]?.message?.content;


   } catch (error: any) {
      console.log(error);
      res.status(500).send({
         status: "error",
         message: error.message || "Internal server error",
      });
   }
};


// =============================================================
// search for matching id attribute value coming from frontend
// =============================================================
const getSearchedData = (dbData: { [key: string]: any }, htmlData: { [key: string]: any }) => {

   //return value
   let result: { [key: string]: any } = {};
   let notFoundKeys: string[] = [];

   for (let key in htmlData) {
      //check if the key is found in the dbData
      if (dbData.hasOwnProperty(key)) {
         result[key] = dbData[key];
      } else {
         notFoundKeys.push(key);

         // what is asking by the key in the htmlData
         const keyLable = htmlData[key];

         for (let dbKey in dbData) {
            //check if the asking info matches with any dbDataMap
            if ((dbDataMap as { [key: string]: string })[dbKey] === keyLable) {
               result[key] = dbData[dbKey];
               notFoundKeys = notFoundKeys.filter((item) => item !== key);
               break
            }
         }

      }
   }

   return {
      matchedData: result,
      notFoundKeys: notFoundKeys,
   };
}

