import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/UserModel.js'

dotenv.config()

const hasGoogleCreds = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

if (hasGoogleCreds) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id })

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails?.[0]?.value || `${profile.id}@google.local`,
          firstName: profile.name?.givenName,
          profilePicture: profile.photos?.[0]?.value || null,
        })
      } else {
        // Update profile picture if it changed
        if (profile.photos?.[0]?.value && user.profilePicture !== profile.photos[0].value) {
          user.profilePicture = profile.photos[0].value
          await user.save()
        }
      }

      done(null, user)
    } catch (e) {
      console.error('❌ Error in Google Strategy:', e)
      done(e)
    }
  }))
} else {
  console.warn('Google OAuth env not configured. Set GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET to enable OAuth.')
}

// Required even for session: false
passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export const googleOAuthEnabled = hasGoogleCreds
export default passport
