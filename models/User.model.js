const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    firstName: String,
    lastName: String,
    profileImage :{
      type: String,
      default: '/images/profile/default.jpg'
    },
    darkmode:{type:Boolean, default: false},
    password: {
      type: String,
      required: 'Password is required',
    },
    active: {type:Boolean, default: false},
    reset:false
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
