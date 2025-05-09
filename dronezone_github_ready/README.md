# DroneZone E-Commerce Platform

An advanced e-commerce platform specializing in drone sales, offering a comprehensive and innovative shopping experience for drone enthusiasts and professionals.

## Features

- Comprehensive drone product catalog with detailed specifications
- User authentication system (login/registration)
- Shopping cart functionality
- Multiple payment methods including M-Pesa, credit cards, and bank transfer
- Order management and history
- Responsive design for all devices
- Admin dashboard for product management
- Educational blog content
- Customer testimonials

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js
- **State Management**: Context API, React Query

## Local Development Setup

1. Clone the repository
   ```
   git clone https://github.com/your-username/drone-zone-ecommerce.git
   cd drone-zone-ecommerce
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up your environment variables  
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. Run database migrations
   ```
   npm run db:push
   ```

5. Seed the database
   ```
   npm run db:seed
   ```

6. Start the development server
   ```
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5000`

## Deployment

### Database Setup (Neon Postgres)

1. Create a free account at [Neon](https://neon.tech/)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Set it as your DATABASE_URL environment variable in your deployment platform

### Deploying on Vercel/Netlify/Railway

1. Push your code to GitHub
2. Connect your GitHub repository to your chosen platform
3. Set the required environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string for session encryption
4. Deploy the application

## Project Structure

```
/
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and configuration
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Main App component
├── db/               # Database configuration
├── server/           # Backend Express server
│   ├── auth.ts       # Authentication logic
│   ├── routes.ts     # API routes
│   ├── storage.ts    # Database operations
│   └── index.ts      # Server entry point
└── shared/           # Shared code between frontend and backend
    └── schema.ts     # Database schema definitions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- DJI for product information and specifications
- All open-source libraries used in this project