# UniMarket Backend - Spring Boot

This is the backend for the University Market Place application, built using Spring Boot, Spring Data JPA, and MySQL.

## Technology Stack
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Data JPA** (Hibernate)
- **MySQL Database**
- **Lombok** (for cleaner code)
- **Jackson** (for JSON mapping)

## Project Structure
- `src/main/java/com/spring_boot/uni_market/controller`: REST API endpoints.
- `src/main/java/com/spring_boot/uni_market/service`: Business logic.
- `src/main/java/com/spring_boot/uni_market/entity`: Database models.
- `src/main/java/com/spring_boot/uni_market/repo`: Data access layers.
- `src/main/java/com/spring_boot/uni_market/dto`: Data Transfer Objects.
- `src/main/java/com/spring_boot/uni_market/config`: System configurations (CORS, MVC, etc.).

## Key Features
- **User Authentication**: Secure login and registration.
- **Product Management**: CRUD operations for university items.
- **Image Uploads**: Local storage for product and profile images.
- **Real-time Chat**: Messaging system between buyers and sellers.
- **Profile Management**: Customizable student profiles with avatar persistence.

## Getting Started
1. Configure your database in `src/main/resources/application.properties`.
2. Run the application using your IDE or `./mvnw spring-boot:run`.
3. The server will start on `http://localhost:8080`.

## API Documentation
The API documentation is available in the root folder as `API_DOCUMENTATION.md`.
