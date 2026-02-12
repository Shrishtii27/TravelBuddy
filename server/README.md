# Travys Server

1) Copy .env.example to .env and set values
2) npm install
3) npm run dev

Routes
- GET / : health
- GET /api/auth/google : start Google OAuth
- GET /api/auth/google/callback : redirects to FRONTEND_URL/auth/callback with token
