import mongoose from "mongoose";

const BlacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Auto deletion
BlacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BlacklistToken = mongoose.model("Blacklist", BlacklistTokenSchema);

export default BlacklistToken;
