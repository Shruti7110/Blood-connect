# BloodConnect - Blood Transfusion Management System

## Overview

BloodConnect is a comprehensive blood transfusion management application designed to connect patients with thalassemia to donors and healthcare providers. The system facilitates donor family assignment, transfusion scheduling, health monitoring, and emergency blood requests while providing role-based access for patients, donors, and healthcare providers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Authentication**: Client-side auth service with localStorage persistence

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Driver**: Neon Database serverless driver
- **API Design**: RESTful API with role-based endpoints
- **Session Management**: In-memory storage interface (designed for easy database integration)

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Data Validation**: Zod schemas for runtime type checking

## Key Components

### User Management
- **Multi-role system**: Patients, Donors, Healthcare Providers
- **Profile management**: Role-specific data and preferences
- **Authentication**: Email/password with client-side session management

### Donor Family System
- **Family Assignment**: Algorithm to assign 18-20 donors per patient based on blood group and location
- **Availability Tracking**: Real-time donor availability status
- **Notification System**: Automated reminders and transfusion alerts

### Transfusion Management
- **Scheduling**: Patient-initiated transfusion scheduling
- **Status Tracking**: Complete transfusion lifecycle management
- **History**: Comprehensive transfusion and donation records

### Health Monitoring
- **Patient Health Data**: Hemoglobin levels, iron levels, ICT therapy tracking
- **Predictive Analytics**: AI/ML-ready data structure for transfusion frequency prediction
- **Integration Ready**: Designed for iOS HealthKit and Google Fit integration

### Emergency System
- **Emergency Requests**: Urgent blood request system with escalation
- **Multi-level Notifications**: Family → wider network → blood banks
- **Real-time Alerts**: Critical blood shortage notifications

## Data Flow

### User Registration Flow
1. User registers with email, password, and role selection
2. System creates user record and role-specific profile
3. For patients: Automatic donor family assignment begins
4. For donors: Availability status set and location-based matching enabled

### Transfusion Scheduling Flow
1. Patient schedules transfusion through dashboard
2. System notifies assigned donor family (3-5 days advance notice)
3. Tracks donor responses and blood unit availability
4. Escalates to emergency system if supply insufficient
5. Healthcare providers can monitor and approve transfusions

### Emergency Request Flow
1. Patient or provider initiates emergency request
2. Immediate notification to donor family
3. Real-time tracking of available units vs. required
4. Escalation to wider donor network and blood banks
5. Integration with e-RaktKosh API for external donor pools

## External Dependencies

### UI and Frontend
- **Radix UI**: Comprehensive primitive component library
- **Tailwind CSS**: Utility-first CSS framework
- **TanStack Query**: Powerful data synchronization
- **React Hook Form**: Form management with validation

### Backend and Database
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL
- **Express.js**: Web application framework
- **Zod**: Schema validation library

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Fast development and build tool
- **ESBuild**: Fast JavaScript bundler for production

### Planned Integrations
- **e-RaktKosh API**: Government blood bank integration
- **Apple HealthKit**: iOS health data integration
- **Google Fit**: Android health data integration
- **SMS/Email Services**: Notification delivery

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **Database**: Local PostgreSQL or Neon Database development instance
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Static assets built with Vite to `dist/public`
- **Backend**: Bundled with ESBuild to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command
- **Server**: Node.js server serving both API and static files

### Architecture Decisions

#### Database Choice
- **Problem**: Need for reliable, scalable database with strong consistency
- **Solution**: PostgreSQL with Drizzle ORM
- **Rationale**: ACID compliance for critical health data, strong typing, excellent tooling
- **Alternatives**: MongoDB (rejected due to need for relational data), Supabase (could be integrated later)

#### Frontend Framework
- **Problem**: Need for reactive UI with good TypeScript support
- **Solution**: React with TypeScript and modern tooling
- **Rationale**: Large ecosystem, excellent TypeScript support, mature component libraries
- **Benefits**: Fast development, type safety, extensive community resources

#### Authentication Strategy
- **Problem**: Need for simple, secure user authentication
- **Solution**: Custom auth service with localStorage persistence
- **Rationale**: Simple implementation for MVP, easily replaceable with more robust solutions
- **Future**: Can be upgraded to JWT tokens, OAuth, or third-party auth providers

#### API Design
- **Problem**: Need for organized, role-based API endpoints
- **Solution**: RESTful API with Express.js and role-based routing
- **Rationale**: Simple to implement, widely understood, easy to test and document
- **Benefits**: Clear separation of concerns, easy to scale and modify