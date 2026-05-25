# Logging Platform

A comprehensive, full-stack logging platform that allows developers to collect, manage, and visualize application logs in real-time. The platform provides an intuitive dashboard for monitoring logs across multiple applications.

## Features

- **Multi-Application Support**: Manage logs from multiple applications through a unified interface
- **Real-Time Log Visualization**: View and filter logs in real-time with advanced search capabilities
- **API Key Management**: Generate and manage API keys for secure application authentication
- **User Authentication**: Secure registration and login system with JWT-based authentication
- **Log Insights**: Get actionable insights from your logs with visualization and analytics
- **RESTful API**: Comprehensive REST API for log ingestion and management
- **SDK Integration**: Easy-to-use JavaScript SDK for integrating logging into your applications
- **Role-Based Access**: User account management and application-specific permissions

## Architecture

The platform is built as a monorepo with three main components:

### 1. **Server** (`apps/server`)

- Express.js backend API
- MongoDB database integration
- User authentication and authorization
- Log collection and storage
- Application management

### 2. **Client** (`apps/client`)

- Next.js dashboard application
- React components with Tailwind CSS
- Real-time log viewing and filtering
- User and application management interfaces
- Responsive design

### 3. **SDK** (`apps/sdk`)

- JavaScript/Node.js logging SDK
- Simple API for log submission
- Support for different log levels (INFO, ERROR, WARN, DEBUG)
- Batch and single log submission

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 3.x
- **MongoDB** (local or cloud instance)
- Modern web browser for the dashboard

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/abdelrahman202122/logging-platform.git
cd logging-platform
```

### 2. Install Dependencies

Install root dependencies:

```bash
npm install
```

Install dependencies for each app:

```bash
npm install --workspace apps/server
npm install --workspace apps/client
npm install --workspace apps/sdk
```

Or install all at once:

```bash
npm install -ws
```

### 3. Environment Configuration

Create a `.env` file in `apps/server` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/logging-platform
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

Create a `.env.local` file in `apps/client` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Running the Project

### Start the Server

```bash
cd apps/server
npm run dev
```

The API will be available at `http://localhost:5000`

### Start the Client

In a new terminal:

```bash
cd apps/client
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Running Both Concurrently

From the root directory, you can use:

```bash
npm run dev --workspaces
```

## Project Structure

```
logging-platform/
├── apps/
│   ├── client/              # Next.js dashboard
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── ui/          # Reusable UI components
│   │   └── lib/             # Utility functions and types
│   ├── server/              # Express.js API
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── validators/      # Input validation
│   │   └── config/          # Configuration files
│   └── sdk/                 # JavaScript SDK
│       ├── src/             # SDK source code
│       └── test/            # SDK tests
└── README.md
```

## API Documentation

### Authentication Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (requires auth)
- `POST /api/users/logout` - Logout user

### Application Endpoints

- `POST /api/applications` - Create a new application
- `GET /api/applications` - List user applications
- `GET /api/applications/:name` - Get application details
- `PUT /api/applications/:name` - Update application
- `DELETE /api/applications/:name` - Delete application
- `POST /api/applications/:name/logs` - Submit logs (requires API key)
- `GET /api/applications/:name/logs` - Get application logs

## SDK Usage

### Installation

```bash
npm install logging-platform-server-sdk
```

### Basic Usage

```javascript
const loggingPlatform = require('logging-platform-server-sdk');

// Initialize the SDK
loggingPlatform.init({
  apiKey: process.env.LOGGING_PLATFORM_API_KEY,
  applicationName: 'my-app',
  baseUrl: 'http://localhost:5000', // or your production URL
});

// Log a message
await loggingPlatform.log({
  level: 'INFO',
  message: 'Application started successfully',
});

// Log an error
await loggingPlatform.log({
  level: 'ERROR',
  message: 'An error occurred',
  metadata: { userId: 123, action: 'payment' },
});
```

### Creating Isolated Clients

```javascript
const { createClient } = require('logging-platform-server-sdk');

const logger = createClient({
  apiKey: process.env.LOGGING_PLATFORM_API_KEY,
  applicationName: 'billing-service',
});

await logger.log({
  level: 'WARN',
  message: 'High response time detected',
});
```

## Available Log Levels

- `DEBUG` - Detailed information for diagnosing problems
- `INFO` - General informational messages
- `WARN` - Warning messages for potentially harmful situations
- `ERROR` - Error messages for error conditions

## Development

### Running Tests

```bash
cd apps/server
npm test

cd apps/client
npm test

cd apps/sdk
npm test
```

### Linting

```bash
# Lint server
cd apps/server
npm run lint:fix

# Lint client
cd apps/client
npm run lint
```

## Database

The platform uses MongoDB for data persistence. Models include:

- **Developer**: User accounts with authentication credentials
- **Application**: Applications registered in the platform
- **Log**: Application logs with timestamps and metadata

## Security Features

- JWT-based authentication
- API key validation for log submission
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization
- Error handling middleware

## Deployment

### Server Deployment

The server can be deployed to services like:

- Heroku
- Railway
- AWS EC2
- DigitalOcean
- Render

Set environment variables for production:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
```

### Client Deployment

The Next.js client can be deployed to:

- Vercel (recommended)
- Netlify
- AWS Amplify
- DigitalOcean

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

**Abdelrahman Ezzat**

## Support

For support, please open an issue on the GitHub repository or contact the maintainers.

## Roadmap

- [ ] Real-time log streaming via WebSockets
- [ ] Advanced log filtering and search
- [ ] Log retention policies
- [ ] Email notifications for critical logs
- [ ] Integration with popular logging services
- [ ] Mobile app support
- [ ] Advanced analytics and reporting
