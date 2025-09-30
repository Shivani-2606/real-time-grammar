# GrammarPro - Real-Time Grammar Checker

A comprehensive web application for real-time grammar checking and writing improvement with user authentication, multiple writing styles, and detailed feedback.

## Features

- **Real-time Grammar Checking**: Instant feedback as you type
- **Multiple Writing Styles**: Formal, Casual, Academic, Business, Creative
- **User Authentication**: Secure signup/login with comprehensive validation
- **Writing Analytics**: Word count, character count, accuracy scores
- **Admin Dashboard**: View and manage user feedback
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS with custom design tokens

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

## Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd real-time-grammar-checker
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory and add the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Grammar Engine base (public cloud or your local server)
# If not set, the app’s API route can default to public LanguageTool
NEXT_PUBLIC_GRAMMAR_API_BASE=

# Development Redirect URL
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/checker
\`\`\`

### 4. Supabase Setup

#### 4.1 Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Wait for the project to be fully initialized
4. Go to Settings > API to get your project URL and anon key

#### 4.2 Database Schema Setup

Run the following SQL commands in your Supabase SQL Editor or use the provided scripts:

**Create Users Table (Enhanced):**
\`\`\`sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
\`\`\`

**Create Feedback Table:**
\`\`\`sql
CREATE TABLE public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'bug', 'feature', 'technical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback
CREATE POLICY "Users can view own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policy (you'll need to create an admin role)
CREATE POLICY "Admins can view all feedback" ON public.feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email LIKE '%@yourdomain.com'  -- Replace with your admin domain
    )
  );
\`\`\`

**Create Grammar Sessions Table (Optional - for saving user sessions):**
\`\`\`sql
CREATE TABLE public.grammar_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  writing_style TEXT DEFAULT 'formal',
  issues_found INTEGER DEFAULT 0,
  accuracy_score DECIMAL(5,2) DEFAULT 100.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.grammar_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own sessions" ON public.grammar_sessions
  FOR ALL USING (auth.uid() = user_id);
\`\`\`

#### 4.3 Authentication Setup

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/checker`
3. Enable email confirmation if desired (optional for development)

#### 4.4 Storage Setup (Optional)

If you plan to add file upload features:

\`\`\`sql
-- Create a bucket for user uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', true);

-- Create policy for user uploads
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
\`\`\`

### 5. Database Migration Scripts

The project includes migration scripts in the `scripts/` folder. You can run these directly in Supabase SQL Editor:

1. `01-create-users-table.sql` - Sets up user profiles and authentication
2. `02-create-feedback-table.sql` - Creates feedback system tables

### 6. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── admin/             # Admin dashboard
│   ├── checker/           # Grammar checker main page
│   ├── contact/           # Contact page
│   ├── settings/          # User settings
│   └── about/             # About page
├── components/            # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   └── navigation.tsx    # Main navigation
├── lib/                  # Utility functions
│   ├── supabase.ts      # Supabase client
│   └── validation.ts    # Form validation utilities
├── scripts/              # Database migration scripts
└── public/              # Static assets
\`\`\`

## Key Features Implementation

### Authentication System

- **Comprehensive Validation**: Email format, password strength, name validation
- **Real-time Feedback**: Instant validation as users type
- **Password Requirements**: Uppercase, lowercase, numbers, special characters
- **Email Uniqueness**: Prevents duplicate registrations
- **Secure Authentication**: Powered by Supabase Auth

### Grammar Checker

- **Real-time Processing**: Grammar checking as you type with debouncing
- **Multiple Writing Styles**: Formal, Casual, Academic, Business, Creative
- **Visual Feedback**: Color-coded highlighting for errors, suggestions, improvements
- **Writing Analytics**: Word count, character count, accuracy scores
- **Two-column Layout**: Text input on left, real-time feedback on right

### Admin Dashboard

- **Feedback Management**: View and manage user feedback
- **User Analytics**: Track user engagement and feedback trends
- **Search and Filter**: Find specific feedback easily
- **Status Management**: Track feedback resolution status

## Validation Rules

### Email Validation
- Must be a valid email format
- Cannot be empty
- Must be unique (no duplicate registrations)

### Password Validation
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

### Name Validation
- Minimum 2 characters
- Cannot contain numbers
- Cannot contain special characters
- Only letters and spaces allowed

## Grammar Checking Patterns

The grammar checker uses pattern matching to identify:

- **Spelling Errors**: Common misspellings (alot → a lot, recieve → receive)
- **Grammar Issues**: Subject-verb agreement, tense consistency
- **Style Suggestions**: Passive voice detection, wordiness
- **Punctuation**: Missing commas, apostrophe usage
- **Writing Style**: Formal vs casual language based on selected style

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase redirect URLs to include your production domain

### Environment Variables for Production

Update your Supabase project settings:
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**: Add your production URL

## Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify environment variables are correct
   - Check if Supabase project is active
   - Ensure RLS policies are properly configured

2. **Authentication Problems**
   - Check redirect URLs in Supabase settings
   - Verify email confirmation settings
   - Ensure auth policies are correctly set up

3. **Database Errors**
   - Run migration scripts in correct order
   - Check if RLS is properly enabled
   - Verify user permissions

### Development Tips

- Use Supabase logs to debug authentication issues
- Check browser console for client-side errors
- Use Supabase SQL Editor to test queries directly
- Enable detailed logging in development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review Supabase documentation for database-related issues

## Windows Setup (Step-by-Step)

Follow these steps to run GrammarPro on Windows 10/11.

1) Install prerequisites
- Git: Download from https://git-scm.com and install with defaults. Verify in PowerShell:
  - git --version
- Node.js (via nvm-windows recommended):
  - Download “nvm-setup.exe” from https://github.com/coreybutler/nvm-windows/releases
  - In PowerShell:
    - nvm install 20
    - nvm use 20
    - node -v
    - npm -v
- VS Code: Install from https://code.visualstudio.com (verify: code --version)
- Optional (for local grammar server): Java 17+
  - Install Temurin (Adoptium). Verify: java -version

2) Get the code
- Via Git:
  - git clone <your-repository-url>
  - cd real-time-grammar-checker
- Or from v0: Download ZIP → unzip → cd into the folder

3) Install dependencies
- npm install
  - or pnpm install (after npm i -g pnpm)

4) Configure environment variables
Create a file named .env.local in the project root with:

\`\`\`env
# Supabase (if using auth/features that need it)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Grammar Engine base (public cloud or your local server)
# If not set, the app’s API route can default to public LanguageTool
NEXT_PUBLIC_GRAMMAR_API_BASE=

# Dev redirect
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/checker
\`\`\`

5) Choose your Grammar Engine
You have two easy options.

- Option A — Public LanguageTool (no install, rate limits apply)
  - Endpoint: https://api.languagetool.org/v2/check
  - Leave NEXT_PUBLIC_GRAMMAR_API_BASE empty (the route can default to public LT).

- Option B — Local LanguageTool server (faster, offline)
  - Download LT server ZIP: https://languagetool.org/download
  - Unzip, then run in that folder:
    - java -cp languagetool-server.jar org.languagetool.server.HTTPServer --port 8010 --allow-origin "*"
  - Test it:
    - curl -X POST "http://localhost:8010/v2/check" ^
      -H "Content-Type: application/x-www-form-urlencoded" ^
      --data "text=He%20is%20not%20work%20properly.&language=en-US&level=picky"
  - Set in .env.local:
    - NEXT_PUBLIC_GRAMMAR_API_BASE=http://localhost:8010

6) Start the dev server
- npm run dev
- Open http://localhost:3000/checker

7) Quick verification (should flag errors)
Paste these and confirm issues appear with fixes:
- She don't likes to go outside when it’s rain.
  - Should suggest: She doesn’t like to go outside when it’s raining.
- He is not work properly.
  - Should suggest: He is not working properly.
- He are late.
  - Should suggest: He is late.

## Grammar Engine Integration Details

The app calls a Next.js route that proxies to LanguageTool using form-encoded payloads. If you modify it, ensure:
- Content-Type: application/x-www-form-urlencoded
- Required fields:
  - text: user text
  - language: en-US (or en-GB)
  - level: picky (or default)

Example request body:
\`\`\`txt
text=He%20is%20not%20work%20properly.&language=en-US&level=picky
\`\`\`

### Troubleshooting Grammar API

- 400 “Missing 'text' or 'data'”
  - Cause: Sending JSON or wrong content type
  - Fix: Use URLSearchParams or x-www-form-urlencoded; set proper headers

- 0 errors for obviously wrong sentences
  - Ensure language=en-US and level=picky
  - Confirm the textarea’s content is actually sent to the API
  - Temporarily log in the route:
    - console.log("[v0] LT payload:", { text: text.slice(0, 80), language, level });

- CORS issues when calling LT directly
  - Prefer the app’s /api/grammar-check proxy
  - For local LT server, run with --allow-origin "*"

- Port already in use
  - Next.js: set a different port
    - PowerShell: $env:PORT=3001; npm run dev
  - LT server: use --port 8011

### Sanity Tests

Try the following to confirm behavior:
- He is not work properly. → He is not working properly.
- She don’t likes to go outside when it’s rain. → She doesn’t like to go outside when it’s raining.
- I has a pen. → I have a pen.
- They doesn’t know. → They don’t know.

---

**Happy coding! 🚀**
