# Renewable Energy Utilization Optimizer

A full-stack MERN application designed to help retail businesses optimize their energy consumption by integrating renewable energy sources.

## 🚀 Project Status: PRODUCTION READY

This application has been fully developed, debugged, and tested. Both frontend and backend are working properly with all features implemented.

## ✅ Features Implemented

### Authentication & User Management
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/Retailer)
- Password encryption with bcrypt
- Profile management

### Energy Management
- Energy usage tracking and recording
- Renewable vs non-renewable energy monitoring
- Real-time energy consumption dashboard
- Historical data visualization
- Carbon footprint tracking

### AI-Powered Recommendations
- Machine learning-based energy optimization suggestions
- Cost savings analysis
- Carbon reduction recommendations
- Actionable improvement plans

### Admin Features
- User management dashboard
- System-wide energy analytics
- Recommendation oversight

### Modern UI/UX
- Responsive design with Tailwind CSS
- Interactive charts and visualizations
- Dark/light theme support
- Mobile-friendly interface

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** and security middleware

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

## 🏃‍♂️ Running the Application

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Git

### Quick Start

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd GGGG

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

2. **Set Up Environment Variables**

Server `.env` (in `/server/.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
BCRYPT_ROUNDS=12
```

Client `.env` (in `/client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start the Application**

**Development Mode (Recommended):**
```bash
# Terminal 1 - Start Backend
cd server && npm run dev

# Terminal 2 - Start Frontend
cd client && npm run dev
```

**Production Mode:**
```bash
# Build frontend
cd client && npm run build

# Start backend in production
cd server && npm start
```

### Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 🧪 Testing Credentials

**Demo Retailer Account:**
- Email: demo@example.com
- Password: demo123

**Admin Account:**
- Email: admin@example.com  
- Password: admin123

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Energy Management
- `GET /api/energy` - Get energy usage records
- `POST /api/energy` - Create energy usage record
- `PUT /api/energy/:id` - Update energy record
- `DELETE /api/energy/:id` - Delete energy record

### Recommendations
- `GET /api/recommendations` - Get recommendations
- `POST /api/recommendations/generate` - Generate new recommendations
- `PUT /api/recommendations/:id` - Update recommendation status

### Admin
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## 🔧 Project Structure

```
GGGG/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── utils/         # Utility functions
│   │   └── types/         # Type definitions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set production environment variables
2. Update MONGODB_URI to production database
3. Deploy using `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Update VITE_API_URL to production backend URL

### Environment Configuration
- Update CORS origins in backend for production domains
- Set NODE_ENV=production
- Use secure JWT secrets
- Configure proper database indexes

## 🔒 Security Features

- JWT token expiration and refresh
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- MongoDB injection protection

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🐛 Known Issues & Solutions

All major issues have been resolved:
- ✅ Express v5 routing conflicts (downgraded to Express v4)
- ✅ TypeScript compilation errors (converted to JavaScript)
- ✅ CORS configuration
- ✅ MongoDB connection and schema validation
- ✅ JWT authentication flow
- ✅ Frontend routing and state management
- ✅ Vite environment variables (`process.env` → `import.meta.env`)

### Common Troubleshooting

**Frontend "process is not defined" Error:**
- **Issue:** Using `process.env` in Vite-based React app
- **Solution:** Use `import.meta.env.VITE_*` instead of `process.env.REACT_APP_*`
- **Fixed in:** `/client/src/utils/api.js`

**Tailwind CSS Not Loading:**
- **Issue:** Missing CSS imports or configuration
- **Solution:** Ensure `@tailwind` directives are in `src/index.css` and config is proper
- **Fixed in:** `/client/src/index.css`, `/client/tailwind.config.js`, `/client/postcss.config.js`

**Backend Validation Errors:**
- **Issue:** Frontend sending wrong enum values for `role` and `businessType`
- **Solution:** Use correct enum values: roles = `['admin', 'retailer']`, businessTypes = `['grocery', 'clothing', 'electronics', 'restaurant', 'pharmacy', 'other']`
- **Fixed in:** `/client/src/pages/RegisterPage.jsx`, `/client/src/pages/AddEnergyPage.jsx`

**localStorage JSON Parse Error:**
- **Issue:** AuthContext trying to parse invalid localStorage data (e.g., "undefined" string)
- **Solution:** Added validation to check for valid JSON before parsing, automatic cleanup of invalid data
- **Fixed in:** `/client/src/contexts/AuthContext.jsx`
- **Manual Fix:** Visit `/clear-storage.html` to manually clear browser storage

**Port Conflicts:**
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Application is ready for production use!**

The MERN stack application is fully functional with:
- Complete authentication system
- Energy tracking and analytics
- AI-powered recommendations
- Admin dashboard
- Modern responsive UI
- Production-ready backend API

For any issues or questions, please check the troubleshooting section or create an issue.
