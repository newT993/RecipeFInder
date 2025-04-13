Receipt Finder App [Vercel](https://recipe-finder-six-xi.vercel.app/)

A Next.js application for managing recipes and ingredients with expiry date tracking. Currently under active development.

🚧 Development Status 

✅ Basic application structure

✅ Authentication system (google in progress)

✅ Database functionality (with Email Credentials)

✅ Recipe management 

✅ Ingredient tracking

🔧 Known Issues

Google login is currently not working 
Local development works with PostgreSQL

🛠️ Tech Stack
Next.js 14
TypeScript
Prisma ORM
PostgreSQL (Neon)
TailwindCSS
JWT Authentication

📋 Prerequisites
Node.js 18+
npm or yarn
PostgreSQL (for local development)<br>

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result or [on vercel](https://recipe-finder-six-xi.vercel.app/).
<br>

🚀 Getting Started
Clone the repository
```
bash
git clone [your-repo-url]
cd receiptfinder
```
Install dependencies
```bash
npm install
```
Set up environment variables Create a .env file in the root directory:
```
DATABASE_URL="your-postgresql-url"
DIRECT_URL="your-direct-connection-url"
JWT_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-secret"
NEXTAUTH_URL="your-nextauth-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL_INTERNAL="your-next-url-internal"
```
Generate Prisma Client
```
npx prisma generate
```
Run development server
```
npm run dev
```

🌐 Deployment
The application is deployed on Vercel but currently experiencing google login and some database connectivity issues. 

🤝 Contributing
Feel free to contribute by:

Forking the repository
Creating a feature branch
Making your changes
Submitting a pull request

⚠️ Current Development Focus
Implementing proper error handling
Completing user authentication flow
Adding recipe management features
