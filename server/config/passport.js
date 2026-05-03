import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import pool from './postgres.js'

dotenv.config()

const hasGoogleCreds = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

if (hasGoogleCreds) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Try to find user by google_id
      let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
      let user = result.rows[0];

      if (!user) {
        // 2. If no google_id, try to find by email
        const email = profile.emails?.[0]?.value;
        if (email) {
          const emailResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
          user = emailResult.rows[0];
          
          if (user) {
            // 3. Link google_id to existing email account
            await pool.query(
              'UPDATE users SET google_id = $1, profile_picture = COALESCE(profile_picture, $2), updated_at = CURRENT_TIMESTAMP WHERE id = $3',
              [profile.id, profile.photos?.[0]?.value || null, user.id]
            );
            user.google_id = profile.id;
          }
        }

        // 4. If still no user, create a new one
        if (!user) {
          const newUserResult = await pool.query(
            'INSERT INTO users (google_id, email, first_name, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *',
            [
              profile.id,
              profile.emails?.[0]?.value || `${profile.id}@google.local`,
              profile.name?.givenName,
              profile.photos?.[0]?.value || null,
            ]
          );
          user = newUserResult.rows[0];
        }
      } else {
        // 5. Update profile picture if it changed
        if (profile.photos?.[0]?.value && user.profile_picture !== profile.photos[0].value) {
          await pool.query('UPDATE users SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [profile.photos[0].value, user.id]);
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
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export const googleOAuthEnabled = hasGoogleCreds
export default passport
