KeyM Booking System
Welcome to the KeyM Booking System, a backend service designed for managing bookings using NestJS and MongoDB.

- Overview
This project provides a RESTful API for handling hotel bookings, including creating, reading, updating, and deleting bookings. It uses NestJS for its backend logic, coupled with Prisma for database interactions.

```text
Project Structure
├── node_modules/                  # Node.js dependencies
├── prisma/                        # Prisma-related files
│   ├── schema.prisma              # Prisma schema definition
├── src/                           # Application source code
│   ├── app/                       # Core app files
│   ├── auth/                      # Authentication module
│   ├── booking/                   # Booking module
│   ├── prisma/                    # Prisma service-related files
│   ├── user/                      # User module
│   ├── types/                     # Custom Type Definitions
│   ├── main.ts                    # Application entry point
├── .env                           # Environment variables
├── .env.example                   # Example of environment variables
├── .eslintrc.js                   # ESLint configuration
├── .gitignore                     # Git ignore file
├── .prettierrc                    # Prettier configuration
├── Dockerfile.txt                 # Dockerfile for building container
├── nest-cli.json                  # NestJS CLI configuration
├── package-lock.json              # NPM lock file
├── package.json                   # NPM package configuration
├── README.md                      # Project README
├── task.md                        # Task documentation
├── tsconfig.build.json            # TypeScript build configuration
├── tsconfig.json                  # TypeScript configuration file
```

- Getting Started
Prerequisites
Node.js v22.11.0
MongoDB (for database)

- Installation
Clone the repository:
```bash
git clone https://github.com/rudenkoserhii/test-keym
cd test-keym
```
- Install dependencies:
```bash
npm install
```
- Set up environment variables:
Copy .env.example to .env and fill in the necessary values, especially DATABASE_URL for connecting to MongoDB.
Run the application:
```bash
npm run start:dev
```

- Alternatively, for production:
```bash
npm run start:prod
```

- Running Tests
Unit Tests:
```bash
npm run test
```

- Features Implemented
User Authentication: Using JWT for secure API access.
Booking Management: CRUD operations for bookings.
Create a booking with validation to avoid time conflicts.
Retrieve all bookings or a specific booking by ID.
Update and delete bookings.
API Documentation: Swagger is integrated for API documentation accessible at /api/docs.

- API Documentation
Access the Swagger UI at http://localhost:5555/api/docs for detailed API endpoint descriptions.

- Code Quality
Follows NestJS best practices for structure and modularity.
Uses ESLint and Prettier for code linting and formatting.
Comprehensive unit and integration tests with Jest.

- Assumptions and Notes
The application assumes MongoDB is set up with the database URL provided in .env.
Time validations (like ensuring start time is before end time) are handled server-side.
User authentication is implemented with JWT, but session management uses express-session for this example.

- Deployment
The project includes a Dockerfile.txt for containerization. To deploy:
```bash
docker build -t keym-booking-system .
docker run -p 5555:5555 keym-booking-system
```
For cloud deployment, services like Render, Vercel, or Railway can be used. Ensure the DATABASE_URL environment variable is correctly set in your deployment environment.

- Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

- License
This project is unlicensed - see the package.json for more details.