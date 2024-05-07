import mongoose from 'mongoose';

const userCollection = 'users';

const DocumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    first_name: {
        type:String,
        required:true
    },
    last_name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    carts: {
        type: [
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts",
            }
        ],
    },
    role: {
        type: String,
        enum:['user', 'admin','premium'],
        default:'user'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    documents: [DocumentSchema],
    last_connection: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre("find", function() {
    this.populate("carts.cart");
});

const User = mongoose.model(userCollection, UserSchema);

export default User;