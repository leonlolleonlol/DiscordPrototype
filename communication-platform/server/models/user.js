import mongoose from "mongoose"

 const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Hashed password
    avatar: { type: Number, required: true }, // Profile picture URL ( we will be storing the image in the cloud )
    status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Friend list
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role-based access control
    nbSessions: { type: Number, default: 0 } // number of sign ins
});

const userModel= mongoose.model("users",userSchema)
export default userModel
