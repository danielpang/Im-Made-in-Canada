# Made in Canada Product Registry

A full-stack web application for listing products that are made in Canada. This application allows users to:
- Browse products made in Canada
- Add new products with details and proof of Canadian origin
- Search for specific products
- Edit or delete existing products

## Tech Stack

### Backend
- **Express.js**: Web server framework
- **MongoDB**: NoSQL database for storing product information
- **Mongoose**: MongoDB object modeling for Node.js
- **Multer**: Middleware for handling file uploads

### Frontend
- **React**: JavaScript library for building the user interface
- **React Router**: For navigation between pages
- **Chakra UI**: Component library for building the UI
- **Axios**: HTTP client for making API requests

## Features

1. **Product Listings**: Displays all products in a responsive grid layout
2. **Product Details**: View detailed information about each product
3. **Search Functionality**: Search for products by name or description
4. **Add/Edit Products**: Form for adding new products or editing existing ones
5. **Image Upload**: Upload and display product images
6. **Proof of Origin**: Document how a product is made in Canada
7. **Responsive Design**: Looks great on desktop and mobile devices

## Project Structure

```
├── backend/              # Express.js server
│   ├── server.js         # Main server file
│   ├── package.json      # Backend dependencies
│   └── uploads/          # Directory for uploaded images
│
└── frontend/             # React application
    ├── public/           # Static files
    ├── src/              # Source code
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── App.js        # Main component
    │   └── index.js      # Entry point
    └── package.json      # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm run dev
   ```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd react-ui
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will open in your browser at http://localhost:3000

## Database Schema

The MongoDB schema for products includes:

- **name**: Name of the product
- **purchaseLink**: URL where the product can be purchased
- **imagePath**: Path to the uploaded product image
- **description**: Detailed description of the product
- **proofOfOrigin**: Information about how the product is made in Canada
- **createdAt**: Timestamp when the product was added

## API Endpoints

- **GET /api/items**: Get all products
- **GET /api/items/:id**: Get a specific product by ID
- **GET /api/items/search?query=...**: Search for products
- **POST /api/items**: Create a new product
- **PUT /api/items/:id**: Update an existing product
- **DELETE /api/items/:id**: Delete a product

## Future Enhancements

- User authentication and role-based access
- Product categories and filtering
- User reviews and ratings
- Social media sharing
- Advanced search options
- Canadian province/territory filtering
- Verified badge for confirmed Canadian products