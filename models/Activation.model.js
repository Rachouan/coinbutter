const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const activationSchema = new Schema(
  {
    code: {
        type: Number,
        trim: true,
        lowercase: true,
        required: 'An activation code is required'
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    active: {type: Boolean, default: false}
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Activation = model("Activation", activationSchema);

module.exports = Activation;
