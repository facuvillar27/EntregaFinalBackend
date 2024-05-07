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

    async getById(uid) {
        try {
            const user = await usersModel.find({ email: uid });
            return user
        } catch (error) {
            console.error('Error getting user by id:', error)
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

    async updateRole(id, role) {
        try {
            let result = await usersModel.findByIdAndUpdate(id, { role: role });
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

}

export default UsersDao;