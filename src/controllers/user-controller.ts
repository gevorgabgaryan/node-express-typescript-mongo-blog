/* eslint-disable @typescript-eslint/no-unsafe-call */
import bcrypt from "bcrypt";
import {User, IUserDocument} from "../models/user-model";
import {NumerusError} from "../shared/errors";
import Env from "../../env";
import Telegram from "../telegram/telegram";
import {Types} from "mongoose";





class UserController {

    static async all(page: any, itemsPerPage: any, role: any, status: any, keyword: any) {
        try {
            const query: any = {};

            if (status && status !== 'any') {
                query.status = status;
            }
            if (role && role!== 'any') {
                query.role = role;
            }


            if (keyword && keyword.trim()) {
                keyword = keyword.trim();
                query.$or = [
                    {'firstName': new RegExp('^' + keyword, 'i')},
                    {'lastName': new RegExp('^' + keyword, 'i')},
                    {'email': new RegExp('^' + keyword, 'i')},                  
                ];
                if (Types.ObjectId.isValid(keyword)) {
                    query.$or.push({'_id': new Types.ObjectId(keyword)});
                }
            }

            const items: IUserDocument[] | null = await User.find(query).select('-password').skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({_id: -1}).exec();
            const total: number = await User.countDocuments(query);
            
          
            return {
                items,
                total
            }
        } catch (err) {
            console.log(err);
            throw new NumerusError(err.message, 'REGISTER_FAILED')

        }

    }
    static async edit(id: string, userData: any) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NumerusError('Invalid ID', "NUMERUS_INVALID_ID");
        }

        const user = await User.findById(id).select("-password").exec();
        if (!user) {
            throw new NumerusError('User not found', "NUMERUS_USER_NOT_FOUND");
        }

        if (user.status === 'inactive') {
            throw new NumerusError(`Account is inactive`, "NUMERUS_ACCOUNT_INACTIVE");
        }

        if (userData.firstName) {
            if (userData.firstName.length !== 0) {
               user.firstName = userData.firstName;
            } else {
                user.firstName = '';
            }
        }

        if (userData.lastName || userData.lastName === '') {
            if (userData.lastName.length !== 0) {              
                user.lastName = userData.lastName;
            } else {
                user.lastName = '';
            }
        }    

 

        if (userData.lang) {
            user.lang = userData.lang;
        }
        if (userData.status && Env.statuses.includes(userData.status)) {
            user.status = userData.status;
        }

        await user.save();   

        return user;
    }

    static async createAdminUser(email: string, password: string) {
        try {
            const user: IUserDocument | null = await User.findOne({email});
            if (user) {
                return user;
            }
            const encryptedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                firstName: "Admin",
                lastName: "User",
                password: encryptedPassword,
                role: 'admin',
                status: 'active',
                lang: 'en',
            });
            await newUser.save();
            Telegram.notify('info', 'Admin ser registred', newUser.email)
            return true
        } catch (err) {
            console.log(err);
            throw new NumerusError(err.message, 'REGISTER_FAILED')

        }

    }
}

export default UserController;