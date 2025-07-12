# Renewable Energy Utilization Optimizer

A comprehensive full-stack MERN application designed to help retail businesses optimize their renewable energy consumption through intelligent data tracking, analysis, and ML-powered recommendations.

![Energy Dashboard](https://img.shields.io/badge/Status-Development-blue)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### 🔐 Authentication & Authorization
- JWT-based authentication system
- Role-based access control (Admin/Retailer)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 📊 Energy Data Management
- Daily/weekly energy consumption tracking
- Renewable vs non-renewable energy source categorization
- Support for multiple energy sources:
  - **Renewable**: Solar, Wind, Hydro, Other
  - **Non-renewable**: Grid, Generator
- Bulk import functionality for historical data
- Real-time cost and carbon footprint calculations

### 📈 Interactive Dashboard
- Clean, modern UI built with React & Tailwind CSS
- Real-time energy usage visualization with Recharts
- Cost comparison analytics
- Carbon footprint tracking
- Peak vs off-peak usage analysis

### 🤖 ML-Powered Recommendation Engine
- Intelligent analysis of energy usage patterns
- Personalized optimization suggestions
- Cost-saving recommendations
- Environmental impact predictions
- Implementation tracking and progress monitoring

### 👨‍💼 Admin Panel
- User management and monitoring
- Aggregated consumption trends
- System-wide analytics
- User role management

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **React Hook Form** with Yup validation
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security
- **CORS** for cross-origin requests
- **Express Rate Limit** for API protection

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Nodemon** for development
- **Concurrently** for running multiple processes

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd renewable-energy-optimizer
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/renewable-energy-optimizer
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=30d
   BCRYPT_ROUNDS=12
   ```

   Create `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend application on `http://localhost:3000`

## 🎯 Usage

### Demo Credentials

**Administrator Account:**
- Email: `admin@renewableoptimizer.com`
- Password: `admin123`

**Retailer Accounts:**
- Email: `john@grocerystore.com` | Password: `password123`
- Email: `sarah@fashionboutique.com` | Password: `password123`
- Email: `mike@techstore.com` | Password: `password123`
- Email: `lisa@greenpharmacy.com` | Password: `password123`

### Getting Started
1. **Login** with demo credentials or register a new account
2. **Explore the Dashboard** to see energy usage overview
3. **Add Energy Data** to track your consumption
4. **Generate Recommendations** using the ML engine
5. **Implement Suggestions** to optimize your energy usage

## 📱 Application Structure

```
renewable-energy-optimizer/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/       # Common components
│   │   │   └── layout/       # Layout components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
├── server/                    # Node.js backend
│   ├── controllers/          # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── seeds/              # Database seeding
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js           # Entry point
├── .github/
│   └── copilot-instructions.md
├── package.json            # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update profile
- `PATCH /api/auth/change-password` - Change password

### Energy Usage
- `POST /api/energy` - Create energy usage record
- `GET /api/energy` - Get energy usage records
- `GET /api/energy/stats` - Get energy statistics
- `PATCH /api/energy/:id` - Update energy record
- `DELETE /api/energy/:id` - Delete energy record

### Recommendations
- `POST /api/recommendations/generate` - Generate new recommendations
- `GET /api/recommendations` - Get recommendations
- `PATCH /api/recommendations/:id/status` - Update recommendation status
- `GET /api/recommendations/stats` - Get recommendation statistics

### Admin (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/dashboard-stats` - Get dashboard statistics
- `PATCH /api/users/:id/toggle-status` - Toggle user status

## 🌱 Database Schema

### User Model
- Personal information (name, email, password)
- Business details (business name, type, location)
- Role-based access control
- Account status and activity tracking

### Energy Usage Model
- Comprehensive energy consumption data
- Multiple renewable and non-renewable sources
- Cost calculations and carbon footprint
- Peak vs off-peak usage tracking

### Recommendation Model
- ML-generated optimization suggestions
- Priority and status tracking
- Implementation monitoring
- Expiration and cleanup management

## 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern Interface** - Clean and intuitive design with Tailwind CSS
- **Interactive Charts** - Beautiful visualizations with Recharts
- **Real-time Updates** - Live data updates and notifications
- **Accessibility** - WCAG compliant design patterns
- **Dark Mode Ready** - Prepared for dark theme implementation

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run client:build
# Deploy the client/build folder
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
# Set environment variables
# Deploy server folder
```

### Database (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Update MONGODB_URI in production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by home energy monitoring solutions like Sense
- Built with modern web technologies and best practices
- Designed for sustainability and environmental impact

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for a sustainable future** 🌱
