import User from "@/models/user.model";
import { UserType } from "@/utils/types";

/**
 * 
 * @param {string} user_id - user id to get the user data
 * @description - This function is used to get the user data from the database.
 * @returns {Promise<UserType | null>} - returns the user data if found, otherwise null.
 */
async function getUser(user_id: string): Promise<UserType | null> {
    try {
        if (!user_id) {
            return null;
        }

        //get data form database
        const user = await User.findOne({ _id: user_id })
            .lean()
            .select({ _id: 1, name: 1, username: 1, image: 1, profiles: 1, type: 1, emailVerified: 1 }).populate('profiles', 'name username');

        if (!user) {
            return null;
        }

        return {
            id: user._id.toString(),
            username: user.username,
            name: user.name,
            image: user.image,
            profiles: user.profiles,
            type: user.type,
            emailVerified: user.emailVerified,
        };

    } catch (error: any) {
        return null;
    }

}

async function updateUser(user_id: string, data: { name?: string, image?: string }): Promise<UserType | null> {
    try {
        if (!user_id) {
            return null;
        }

        //get data form database
        const updatedUser = await User.findOneAndUpdate({ _id: user_id }, data, { new: true }).populate('profiles', 'name username')

        if (!updatedUser) {
            return null;
        }

        return {
            id: updatedUser._id.toString(),
            username: updatedUser.username,
            name: updatedUser.name,
            image: updatedUser.image,
            profiles: updatedUser.profiles,
            type: updatedUser.type,
            emailVerified: updatedUser.emailVerified,
        };

    } catch (error: any) {
        return null;
    }
}

export { getUser, updateUser }