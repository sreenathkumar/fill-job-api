import express from "express";
import { User } from "../models/userModels";
import ApplicationProfile from "../models/profileModels";
import { getGroqChatCompletion } from "../AI";
import dbDataMapJson from "../utils/dbDataMap.json";
import { log } from "console";
import { ProfileDataType } from "utils/types";
const dbDataMap = dbDataMapJson as { [key: string]: string };

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
      const dbData: ProfileDataType | null = await ApplicationProfile.findOne({ email: req.body.email }).lean();

      console.log("dbData:", dbData);


      if (!dbData) {
         throw new Error("Data not found");
      }

      const { matchedData, notFoundKeys, notFoundData } = getSearchedData(dbData.data, req.body.data);
      let finalData = matchedData;

      const aiCommand = `This is the map of the db data: ${JSON.stringify(dbDataMap)}. Now analyze the sample data map and find in the db data map if any key holds the value of sample data map. If found, then return object like: {[sampleDataMapKey]: [matched dbDataMapKey]}. If not found, then leave the key's value as empty string.Of course return the final object as json. If your response is other than a object then just send null. Here is the sample data map: ${JSON.stringify(notFoundData)}.`;


      if (notFoundKeys?.length > 0) {
         console.log("Ai triggered");
         try {
            const aiResponse = await getGroqChatCompletion(aiCommand);
            const aiData = aiResponse?.choices[0]?.message?.content;

            if (aiData) {
               finalData = { ...finalData, ...JSON.parse(aiData) };
            }

         } catch (error) {
            console.log('AI error:', error);
         }
      }

      res.send({
         status: "success",
         message: "Data fetched successfully",
         data: finalData,
      });

   } catch (error: any) {
      //console.log(error);
      res.status(500).send({
         status: "error",
         message: error.message || "Internal server error",
      });
   }
};


// =============================================================
// search for matching id attribute value coming from frontend
// =============================================================
const getSearchedData = (databaseData: { [key: string]: any }, htmlData: { [key: string]: any }) => {

   //return value
   let result: { [key: string]: any } = {};
   let notFoundKeys: string[] = [];
   let notFound: { [key: string]: string } = {};

   for (let key in htmlData) {
      //check if the key is found in the databaseData
      if (databaseData.hasOwnProperty(key)) {
         result[key] = databaseData[key];
      } else {
         notFoundKeys.push(key);
         const keyLable = htmlData[key]; // what is asking by the key in the htmlData

         for (let dbKey in dbDataMap) {
            //check if the asking info matches with any dbDataMap
            if (dbDataMap[dbKey] === keyLable) {
               result[key] = databaseData[dbKey] || '';
               notFoundKeys = notFoundKeys.filter((item) => item !== key);
               break;
            } else {
               notFound[key] = keyLable;
            }
         }

      }
   }

   return {
      matchedData: result,
      notFoundKeys: notFoundKeys,
      notFoundData: notFound
   };
}

