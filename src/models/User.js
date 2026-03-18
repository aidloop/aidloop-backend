import mongoose from "mongoose";
 const userSchema = new mongoose.Schema(
    {
   fullName: {
    type: String, required: true, lowercase: true,
    
   },
   email: {
    type: String, required: true, lowercase: true,
    unique: true
   },
   password: {
    type: String, required: true, select: false
   },
   role: {
    type: String,
    enum:["volunteer","organizer","admin"],
    default: "volunteer"
   },
   phoneNumber: String,
   profileImage: String,
   skills: [String],
   interests:[String],
   bio: String,
   location: {
    city: String,
    state: String,
    country: String,
   },
   verificationStatus: {
  type: String,
  enum: ["pending","approved","rejected"],
  default: "pending"
},
    isEmailVerified: {
    type: Boolean,
    default: false,
  },
  averageRating: {
  type: Number,
  default: 0
},
  emailVerificationToken: String,
   isActive: {
    type: Boolean,
    default: true,
   },
   totalVolunteerHours: {
    type: Number,
    default: 0,
   },
   otpCode: {
  type: String
},
otpExpires: {
  type: Date
},
otpAttempts: {
  type: Number,
  default: 0
},
   passwordResetToken: String,
passwordResetExpires: Date,

resetOtp: String,
resetOtpExpires: Date,
resetOtpAttempts: { type: Number, default: 0 },

    },
    {timestamps: true}
);

export default mongoose.model("User", userSchema);