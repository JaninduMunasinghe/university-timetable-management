# AF Assignment - Timetable Web application backend 

## Description

This is the backend component for the Application Framework project. It handles server-side logic, routing, and communication with the database.

## Installation

### Prerequisities
   
   - Node.js (v14.x or higher)
   - npm or yarn
   - MongoDB

### Steps

1. Clone this repository.
   
   ```bash
   git clone https://github.com/sliitcsse/assignment-01-JaninduMunasinghe.git
   ```
   
2. Navigate to the project directory.

   ```bash
   cd assignment-01-JaninduMunasinghe
   ```
   
3. Install dependencies.

   ```bash
   npm install
   ```

4. Create a .env file in the root directory and add the following environment variable.

   ```bash
   MONGO_URI = 
   NODE_ENV =
   JWT_SECRET =
   ENROLLMENT_KEY = 
   ```


## Running the application

### Development mode

To run the application in development mode with nodemon

```bash
npm run backend
```

### Production Mode

To run the application in development mode with nodemon

```bash
npm run start_prod
```

### Unit Testing

To run all the unit test cases and integration test cases

```bash
npm run test
```

## POSTMAN Documentation
[POSTMAN Documentation](https://documenter.getpostman.com/view/30584055/2sA35Bc4Pr)


## Dependencies

- bcryptjs: ^2.4.3
- body-parser: ^1.20.2
- cookie-parser: ^1.4.6
- cors: ^2.8.5
- dotenv: ^16.4.5
- express: ^4.18.3
- express-async-handler: ^1.2.0
- jsonwebtoken: ^9.0.2
- mongoose: ^8.2.2
- nodemailer: ^6.9.13
- nodemon: ^3.1.0
- winston: ^3.12.0

## Development Dependencies

- jest: ^29.7.0
- supertest: ^6.3.4

## Database Design

![AF_ER_Diagram drawio (1)](https://github.com/sliitcsse/assignment-01-JaninduMunasinghe/assets/119803307/ed232a0b-9280-40df-8ac7-3b925fc2a0b6)

