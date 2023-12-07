import mongoose from 'mongoose';

const s = String;

const UserSchema = new mongoose.Schema({
  githubId: s,
  googleId: s,
  userName: {
    type: s,
    unique: true,
  },
  fullName: s,
  userEmail: {
    type: s,
    sparse: true,
  },
  verified: Boolean,
  userProfilePicture: s,
  userPassword: s,
  userGithubLink: s,
  preferences: {
    theme: s,
    toolTipisVisible: Boolean,
  },
  mfa: {
    type: Boolean,
    default: false,
  }
});

const User = mongoose.model('appUsers', UserSchema, 'appUsers');

export default User;