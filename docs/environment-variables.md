# Environment Variable Planning

These are the variables roadmap v2 expects us to manage during Vercel setup.

## Website

- `NEXT_PUBLIC_SITE_URL` or framework equivalent
- lead form endpoint configuration
- CAPTCHA keys if used

## App

- `NEXT_PUBLIC_APP_URL` or framework equivalent
- Supabase URL
- Supabase anon key
- Supabase service role key
- Stripe publishable key
- Stripe secret key
- Stripe webhook secret
- email configuration if needed

## Important Rule

Do not commit real secrets to Git.

Use:

- Vercel project environment variables for deployed environments
- local `.env` files for development
- documentation or `.env.example` files for variable names only
