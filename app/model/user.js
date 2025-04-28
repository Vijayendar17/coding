import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,      
    length: 10,         
  },
  password: {
    type: String,
    required: true,
    default: "12345678"  
  },
  sessions: [{
    token: String,
    expiresAt: Date
  }],
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
  }],

});

export default mongoose.models.User || mongoose.model("User", UserSchema);