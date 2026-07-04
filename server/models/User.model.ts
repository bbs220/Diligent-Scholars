import mongoose, { InferSchemaType, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: "" },
    profileAvatar: { type: String, default: "" },
    skillToShare: { type: String, default: "" },
    skillToLearn: { type: String, default: "" },
    location: { type: String, default: "" },
    isOnboarded: { type: Boolean, default: false },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,

    methods: {
      async matchPassword(enteredPassword: string): Promise<boolean> {
        try {
          return await bcrypt.compare(enteredPassword, this.password);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(`😭 Error in matchPassword method: ${errorMessage}`);
          return false;
        }
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`😭 Error in pre-save hook: ${errorMessage}`);
    throw error;
  }
});

export type UserType = InferSchemaType<typeof userSchema>;

export type UserDocument = HydratedDocument<
  UserType,
  typeof userSchema.methods
>;

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
