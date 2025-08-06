# 🩸 Blood Connect - AI-Powered Blood Donation Platform

A comprehensive web application designed to connect thalassemia patients with blood donors, featuring AI-powered assistance and healthcare provider management.

## 🌟 Features

### For Patients
- **Personalized Dashboard**: Track transfusion history, hemoglobin levels, and upcoming appointments
- **Health Monitoring**: Monitor iron levels, transfusion frequency, and medical history
- **Family Management**: Manage family member information and emergency contacts
- **AI Assistant**: Use AI to schedule and cancel appointments
- **Educational Resources**: Access comprehensive thalassemia education materials
- **Appointment Scheduling**: Schedule and manage transfusion appointments

### For Blood Donors
- **Donation Tracking**: Monitor donation history and eligibility status
- **Availability Management**: Update availability for blood donation
- **AI Assistant**: Use AI to schedule and cancel appointments
- **Educational Content**: Learn about blood donation and thalassemia

### For Healthcare Providers
- **Patient Management**: View and manage patient records and transfusion schedules
- **Donor Coordination**: Match patients with suitable donors
- **Hospital Dashboard**: Overview of all patients and donors
- **AI Assistant**: Access medical guidelines and patient recommendations

## 🛠️ Tech Stack

### Frontend
- **React 20** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** components
- **Wouter** for routing
- **React Query** for state management
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **Drizzle ORM** for database operations
- **WebSocket** for real-time features

### AI & Python Integration
- **OpenAI Agents** for AI assistance
- **Python scheduling** for automated tasks
- **Python Recommendation** for sending reminders based on appointment history

### Database
- **PostgreSQL** (via Supabase)
- **Real-time subscriptions**
- **Row Level Security (RLS)**

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.8+
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Blood-connect
   ```

2. **Install dependencies**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Environment Setup**
   ```bash
   # Create .env file
   cp .env.example .env
   ```
   
   Add your environment variables:
   ```env
   SUPABASE_URL=provided
   SUPABASE_ANON_KEY=provided
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build the Docker image
docker build -t blood-connect .

# Run the container
docker run -p 3000:3000 --env-file .env blood-connect
```

### Docker Compose (Optional)
```yaml
version: '3.8'
services:
  blood-connect:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
```
### Example login (for trial purpose)
```
For Patient - email : patient1@email.com  password : password123
For Donor   - email : donor21@email.com  password : password123
For Patient - email : doctor1@email.com  password : password123
```

## 📊 Database Schema

The application uses the following main tables:

- **users**: Core user information (patients, donors, healthcare providers)
- **patients**: Detailed medical information for thalassemia patients
- **donors**: Blood donor information and eligibility
- **healthcare_providers**: Medical professional details
- **emergency_requests**: Blood banks incase of inadaquate supply
- **patient_transfusions**: Transfusion appointment scheduling
- **donors_donations**: Donor-tracking

For detailed schema information, see [SUPABASE_TABLES_REFERENCE.md](./SUPABASE_TABLES_REFERENCE.md)

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run check        # TypeScript type checking

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes to database
```

## 🏗️ Project Structure

```
Blood-connect/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── data/          # Static data and content
├── server/                # Backend Node.js application
│   ├── routes.ts          # API routes
│   ├── database.ts        # Database configuration
│   ├── ai-assistant.ts    # AI integration
│   └── supabase.ts        # Supabase client
├── shared/                # Shared TypeScript types
├── requirements.txt       # Python dependencies
└── Dockerfile            # Docker configuration
```

## 🔐 Authentication & Security

- **Supabase Auth**: Secure user authentication
- **Role-based Access**: Different dashboards for patients, donors, and providers
- **Row Level Security**: Database-level security policies
- **Session Management**: Secure session handling with Express

## 🤖 AI Features

- **Personalized Health Advice**: AI-powered recommendations for patients
- **Donation Guidance**: Smart suggestions for donors
- **Medical Assistance**: Healthcare provider support tools
- **Educational Content**: AI-generated educational materials

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 Testing

```bash
# Run type checking
npm run check

# Test database connection
node test-supabase-connection.js
```

## 📈 Monitoring & Logs

- **Supabase Logs**: Monitor database and API performance
- **Application Logs**: Server-side logging
- **Error Tracking**: Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the [SUPABASE_TABLES_REFERENCE.md](./SUPABASE_TABLES_REFERENCE.md) for technical details

## 🔄 Updates & Maintenance

- Regular security updates
- Database schema migrations
- AI model improvements
- Performance optimizations

---

**Blood Connect** - Connecting lives through technology and compassion 🩸 