import * as profileService from "@/services/profile";
import { sendError, sendSuccess } from "@/utils/response";
import dbDataMapJson from "@utils/dbDataMap.json";
import { Request, Response } from "express";

const dbDataMap = dbDataMapJson as { [key: string]: string };

// =========================================================
// Get single profile of a user
// =========================================================
export const getProfile = async (
   req: Request,
   res: Response
) => {
   try {
      const username = req.params.id as string;

      if (!username) {
         return sendError(res, 'username is required', 401, ['Please provide a valid username of the profile.']);
      }

      //get data form database
      const profile = await profileService.getProfile(username);

      if (!profile) {
         return sendError(res, 'Profile not found', 404, [`There is no profile registered with this "${username}" username.`]);
      }

      //send the success response
      return sendSuccess(res, profile, 'Job profile fetched successfully', 200);

   } catch (error: any) {
      console.log('Error in getting single job profile:', error);
      //send the error response
      return sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong']);
   }
};

// =========================================================
// Get all profiles
// =========================================================
export const getProfiles = async (
   req: Request,
   res: Response
) => {
   try {
      const user_id = res.locals.user_id;

      if (!user_id) {
         console.log('user id not found');
         return sendError(res, 'user id is required', 401, ['User id is missing in the request.']);
      }

      //get data form database
      const profiles = await profileService.getAllProfiles(user_id);

      if (profiles.length === 0) {
         return sendError(res, 'Profiles not found', 404, ['There is no profile registered.']);
      }

      //send the success response
      return sendSuccess(res, profiles, 'Job profiles fetched successfully', 200);

   } catch (error: any) {
      console.log('Error in getAllProfiles controller:', error.message);
      //send the error response
      return sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong']);
   }

};

// =========================================================
// Controller for creating profile
// =========================================================
export const createProfile = async (req: Request, res: Response) => {
   const profileData = req.body;
   const user_id = res.locals.user_id;

   if (!profileData) {
      return sendError(res, 'profile data not found', 401, ['Please provide a valid profile data.']);
   };

   try {
      const createdProfile = await profileService.createProfile({ belongs_to: user_id, ...profileData });

      if (!createdProfile) {
         return sendError(res, 'Profile not created', 404, ['There is some error in creating the profile.']);
      }

      //send the success response
      return sendSuccess(res, createdProfile, 'Job profile created successfully', 200);
   } catch (error: any) {

      console.log('Error in createProfile controller:', error?.message);
      return sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong in creating job profile']);
   }
};

// =========================================================
// Controller for updating profile
// =========================================================
export const updateProfile = async (req: Request, res: Response) => {
   const user_id = res.locals.user_id;
   if (!user_id) {
      return sendError(res, 'user id is required', 401, ['User id is missing in the request.']);
   }

   const username = req.params.id as string;
   const profileData = req.body;

   if (!profileData) {
      return sendError(res, 'Profile data not found', 401, ['Please provide a valid profile data.']);
   };

   try {
      const updatedProfile = await profileService.updateProfile({ ...profileData, username, belongs_to: user_id });

      if (!updatedProfile) {
         return sendError(res, 'Profile not updated', 404, ['There is some error in updating the profile.']);
      }

      //send the success response
      return sendSuccess(res, updatedProfile, 'Job profile updated successfully', 200);
   } catch (error: any) {
      console.log('Error in updateProfile controller:', error?.message);
      return sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong in updating job profile']);
   }
};

// =========================================================
// Controller for deleting profile
// =========================================================
export const deleteProfile = async (req: Request, res: Response) => {
   const username = req.params.id as string;
   if (!username) {
      res.send({ status: 'error', message: 'profile id not found' });
      return sendError(res, 'username is required', 401, ['Please provide a valid username of the profile.']);
   }

   try {
      const deleted = await profileService.deleteProfile(username);
      if (!deleted) {
         return sendError(res, 'Profile not deleted', 404, ['There is some error in deleting the profile.']);
      }
      //send the success response
      sendSuccess(res, deleted, 'Job profile deleted successfully', 200);

   } catch (error: any) {

      console.log('Error in deleteProfile controller:', error?.message);
      return sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong in deleting job profile']);
   }
}

// =========================================================
// Controller for getting job data
// =========================================================
export const getJobDataController = async (
   req: Request,
   res: Response
) => {

   try {
      //get data form database
      //const dbData: ProfileDataType | null = await ApplicationProfile.findOne({ email: req.body.email }).lean();
      const dbData: object = req.body.jobData;

      console.log("dbData:", dbData);


      if (!dbData) {
         throw new Error("Data not found");
      }

      const { matchedData, notFoundKeys, notFoundData } = getSearchedData(dbData, req.body.data);
      let finalData = matchedData;

      // const aiCommand = `This is the map of the db data: ${JSON.stringify(dbDataMap)}. Now analyze the sample data map and find in the db data map if any key holds the value of sample data map. If found, then return object like: {[sampleDataMapKey]: [matched dbDataMapKey]}. If not found, then leave the key's value as empty string.Of course return the final object as json. If your response is other than a object then just send null. Here is the sample data map: ${JSON.stringify(notFoundData)}.`;


      // if (notFoundKeys?.length > 0) {
      //    console.log("Ai triggered");
      //    try {
      //       const aiResponse = await getGroqChatCompletion(aiCommand);
      //       const aiData = aiResponse?.choices[0]?.message?.content;

      //       if (aiData) {
      //          finalData = { ...finalData, ...JSON.parse(aiData) };
      //       }

      //    } catch (error) {
      //       console.log('AI error:', error);
      //    }
      // }

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

