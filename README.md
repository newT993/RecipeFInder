Receipt Finder App
A Next.js application for managing recipes and ingredients with expiry date tracking. Currently under active development.

🚧 Development Status
✅ Basic application structure
✅ Authentication system
❌ Database functionality (In Progress)
❌ Recipe management ( can work if db on vercel works(neon))
❌ Ingredient tracking
🔧 Known Issues

Database functions are currently not working in production (Vercel deployment)
Local development works with PostgreSQL
Working on fixing Neon PostgreSQL integration<br>

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
The application is deployed on Vercel but currently experiencing database connectivity issues. We're working on resolving these with Neon PostgreSQL integration.

🤝 Contributing
Feel free to contribute by:

Forking the repository
Creating a feature branch
Making your changes
Submitting a pull request

⚠️ Current Development Focus
Fixing database connectivity issues in production
Implementing proper error handling
Completing user authentication flow
Adding recipe management features
