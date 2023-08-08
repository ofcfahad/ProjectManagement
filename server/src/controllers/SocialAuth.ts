import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../database/Schemas/User';

const { CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

//Login With Github
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
      callbackURL: `${CALLBACK_URL}/github`,
      scope: ['user:email'],
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        const user = await User.findOne({ userEmail: profile.emails?.[0].value });

        if (user) {
          return done(null, user);
        }

        const newUser = new User({
          githubId: profile.id,
          userName: profile.username,
          fullName: profile.displayName,
          userEmail: profile.emails?.[0].value,
          userProfilePicture: profile.photos?.[0].value,
          userGithubLink: profile.profileUrl,
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const something = async (user: typeof User) => {
  try {
    if (user) {
      const findUser = await User.findOne(user);
      return findUser?._id!;
    }
    console.log('from something: no user');
  } catch (error) {
    console.log(`from something: ${error}`);
  }
};

const authenticateGithub = passport.authenticate('github');

function callbackGithub(req: Request, res: Response) {
  passport.authenticate('github', { failureRedirect: '/' })(req, res, async () => {
    try {
      const user = req.user as typeof User;

      const userId = await something(user);
      const token = jwt.sign({ userId }, process.env.SECRET_KEY!, { expiresIn: '7d' });
      // Return a client-side script that closes the window and sets the token in the main window's local storage
      res.send(`
          <script>
            window.opener.postMessage({ type: 'github-auth-success', token: '${token}' }, '*');
            window.close();
          </script>
        `);
    } catch (err) {
      res.status(500).send({ message: 'Internal server error' });
    }
  });
}




//Login With Google

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID!,
  clientSecret: GOOGLE_CLIENT_SECRET!,
  callbackURL: `${CALLBACK_URL}/google`,
  scope: ['user:email'],
},
async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
  // This function will be called when the user authorizes App
  try {
    const user = await User.findOne({ userEmail: profile.emails?.[0].value });

    if (user) {
      return done(null, user);
    } else {
      // If the user does not exist, create a new user
      const newUser = new User({
        googleId: profile.id,
        fullName: profile.displayName,
        userEmail: profile.emails?.[0].value,
        userProfilePicture: profile.photos?.[0].value,
      });

      await newUser.save();
      return done(null, newUser);
    }
  } catch (error) {
    return done(error);
  }
},
));

const authenticateGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

function callbackGoogle(req: Request, res: Response) {
  passport.authenticate('google', { failureRedirect: '/' })(req, res, async () => {
    try {
      const user = req.user as typeof User;

      const userId = await something(user);
      const token = jwt.sign({ userId }, process.env.SECRET_KEY!, { expiresIn: '7d' });
      // Return a client-side script that closes the window and sets the token in the main window's local storage
      res.send(`
              <script>
                window.opener.postMessage({ type: 'google-auth-success', token: '${token}' }, '*');
                window.close();
              </script>
            `);
    } catch (err) {
      res.status(500).send({ message: 'Internal server error' });
    }
  });
}

export {
  authenticateGithub,
  callbackGithub,
  authenticateGoogle,
  callbackGoogle,
};