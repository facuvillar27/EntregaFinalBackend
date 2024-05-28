import usersModel from "../models/users.model.js";

class UsersDao {
    login = async (username, password) => {
        try {
            const result = await usersModel.find({
                email: username,
                password,
            })
            if (user) {
                await this.updateLastConnection(user._id);
                return user;
            }
            return null;
        } catch (error) {
            console.error("Error logging in user:", error)
        }
    }

    signup = async (user) => {
        try {
            const result = await usersModel.create(user)
            return result;
        } catch (error) {
            console.error("Error signing up user:", error)
        }
    }

    async getAll() {
        try {
            const users = await usersModel.find();
            return users;
        }
        catch (error) {
            console.error('Error getting users:', error);
        }
    }

    async getById(uid) {
        try {
            const user = await usersModel.findOne({ email: uid });
            return user
        } catch (error) {
            console.error('Error getting user by id:', error)
        }
    }

    async update(id, user) {
        try {
            const result = await usersModel.findByIdAndUpdate(id, user);
            return result;
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    async getByParams(params) {
        try {
            const queryObject = {};
            Object.keys(params).forEach(key => {
                queryObject[key] = params[key];
            });
    
            const user = await usersModel.find(queryObject);
            return user;
        } catch (error) {
            console.error('Error getting user by params:', error);
        }
    }
    

    async getByPasswordResetToken(token) {
        try {
            const user = await usersModel.findOne({ resetPasswordToken: token });
            return user;
        } catch (error) {
            console.error('Error getting user by password reset token:', error);
        }
    }

    // async createUser(user) {
    //     if (!user.cart) {
    //         const newCart = new cartModel({ products: [] });
    //         const savedCart = await newCart.save();
    //         user.cart = savedCart._id;
    //     }
    //     let result = await userModel.create(user);
    //     return result;
    // }

    // async getBy(params) {
    //     try {
    //         let result = await usersModel.findOne(params);
    //         return result;
    //     } catch (error) {
    //         console.error('Error getting user by params:', error);
    //     }
    // } 

    // async update (id, user) {
    //     delete user._id;
    //     let result = await userModel.updateOne({ _id: id}, {$set:user})
    //     return result;
    // }

    async updatePassword(user, newPassword) {
        try {
            let result = await usersModel.findByIdAndUpdate(user, { password: newPassword });
            return result;
        } catch (error) {
            console.error('Error updating user password:', error);
        }
    };

    async updateCart(id, user) {
        try {
            let result = await usersModel.findByIdAndUpdate(id, user);
            return result;
        } catch (error) {
            console.error('Error updating user cart:', error);
        }
    };

    async updateRole(user, role) {
        try {
            let result = await usersModel.findByIdAndUpdate(user, { role: role });
            return result;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    }

    async populatedCart(id) {
        try {
            let result = await usersModel.findById(id)
            return result;
        } catch (error) {
            console.error('Error getting user cart:', error);
            throw error;
        }
    }

    async updateUserDocuments(uid, documents) {
        try {
            const result = await usersModel.findByIdAndUpdate(uid, {
                $push: { documents: { $each: documents } },
                $set: { status: 'Document uploaded'}
            }, { new: true });
            return result;
        } catch (error) {
            console.error('Error updating user documents:', error);
        }
    }
    
    async updateLastConnection(userId) {
        try {
            const result = await usersModel.findByIdAndUpdate(userId, { $set: { lastConnection: new Date() } }, { new: true });
            return result;
        } catch (error) {
            console.error('Error updating user last connection:', error);
        }
    }

    async getInactiveUsers(minutes) {
        const cutofDate = new Date(Date.now() - minutes * 60 * 1000);
        try {
            const users = await usersModel.find({ lastConnection: { $lt: cutofDate } });
            return users;
        } catch (error) {
            console.error('Error getting inactive users:', error);
        }
    }

    async deleteUsers(userIds) {
        try {
            const result = await usersModel.deleteMany({ _id: { $in: userIds } });
            return result;
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    }

}

export default UsersDao;