# University Market Place

A specialized e-commerce platform designed for university students to buy, sell, and exchange items within their campus community.

## 🚀 Technology Stack

### Backend
- **Framework:** Java Spring Boot
- **Database:** MySQL
- **Build Tool:** Maven
- **Port:** 8080

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **HTTP Client:** Axios

## 🛠️ Setup & Installation

### Prerequisites
- Java JDK 17 or higher
- Node.js & npm
- MySQL Server

### 1. Database Setup
1. Create a MySQL database named `university-market2`.
2. Update the database credentials in `backend/src/main/resources/application.properties` if they differ from the default:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=
   ```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project or run it directly:
   ```bash
   # Run with Maven Wrapper (Windows)
   ./mvnw spring-boot:run
   ```
   The server will start at `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173` (or the port shown in your terminal).

## ✨ Features
- **User Authentication:** Secure login and registration for students.
- **Product Listing:** Students can upload product details with images.
- **Marketplace:** Browse items categorized by type.
- **User Profile:** Manage listings and profile information.
- **Search & Filter:** Find specific items easily.
