import mongoose from "mongoose"

 const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true, unique: true, trim: true },
    lastname: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Hashed password
    avatar: { type: String, required: true }, // Profile picture URL ( we will be storing the image in the cloud )
    status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Friend list
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role-based access control
});

const userModel= mongoose.model("users",userSchema)
export default userModel
