import JobProfile from "@/models/profile.model";
import { normalizeObj } from "@/utils/others";
import { ProfileDataType } from "@/utils/types";


/**
 * @param {string} username - user id of the user whose profile is to be fetched.
 * @description This function is used to get the job profile data of a user from the database.
 * @returns {Promise<any>} - returns the job profile data for the user.
 */
export const getProfile = async (username: string): Promise<any> => {
    try {
        if (!username) {
            return null;
        }

        //get data form database
        const profile = await JobProfile.findOne({ username }).lean();

        if (!profile) {
            return null

        }

        return profile;

    } catch (error: any) {
        console.log('Error in getProfile service:', error.message);
        return null;
    }
};

/**
 * 
 * @param {string} userId - user id of the user in which all the profiles belong.
 * @description This function is used to get all the job profiles data assigned to a user.
 * @returns {Promise<any>} - returns the job profiles of a user.
 * 
 */
export const getAllProfiles = async (userId: string): Promise<any> => {
    try {
        if (!userId) {
            return [];
        }

        //get data form database
        const profiles = await JobProfile.find({ belongs_to: userId }).lean();

        if (profiles.length === 0) {
            console.log('No profiles found for the user:', userId);
            return [];
        }

        return profiles;

    } catch (error: any) {
        console.log('Error in getAllProfiles service:', error.message);
        return [];
    }
}

/**
 * 
 * @param {ProfileDataType} profileData - profile data of the user to be created.
 * @description This function is used to create a new job profile in the database.
 * @returns {<Promise<ProfileDataType | null>>} - returns the created job profile data.
 * 
 */
export const createProfile = async (profileData?: ProfileDataType): Promise<ProfileDataType | null> => {
    try {
        console.log('Creating profile with data:', profileData);
        if (!profileData) {
            throw new Error('Profile data is required');
        }

        const newProfile = new JobProfile(profileData);
        await newProfile.save();

        if (!newProfile) {
            throw new Error('Failed to create new profile in the database.');
        }

        return normalizeObj(newProfile.toObject()) as ProfileDataType;

    } catch (error: any) {
        if (error?.code === 11000) {
            const field = Object.keys(error.keyValue || {})[0];
            const value = error.keyValue?.[field] || 'value';
            throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" already exists.`);
        }

        throw new Error(error.message || 'Something went wrong while creating profile');

    }
}

/**
 * 
 * @param {ProfileDataType} profileData - profile data of the user to be updated.
 * @description This function is used to update the job profile of a user in the database.
 * @returns {Promise<ProfileDataType | null>} - returns the updated job profile data.
 * 
 */
export const updateProfile = async (profileData: ProfileDataType): Promise<ProfileDataType | null> => {
    try {
        if (!profileData) {
            throw new Error('Profile data is required');
        }

        const updatedProfile = await JobProfile.findOneAndUpdate(
            { username: profileData.username, belongs_to: profileData.belongs_to },
            { $set: profileData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedProfile) {
            throw new Error('Failed to update profile in the database.');
        }

        return normalizeObj(updatedProfile) as ProfileDataType;
    } catch (error: any) {
        console.log('Error in updateProfile service:', error.message);
        throw new Error(error.message || 'Something went wrong while updating profile');
    }
}

export const deleteProfile = async (username: string): Promise<any> => {
    try {
        if (!username) {
            throw new Error('Username is required');
        }

        const deletedProfile = await JobProfile.findOneAndDelete({ username });

        if (!deletedProfile) {
            throw new Error('Failed to delete profile from the database.');
        }

        return normalizeObj(deletedProfile) as ProfileDataType;

    }
    catch (error: any) {
        throw new Error(error.message || 'Something went wrong while deleting profile');
    }
}