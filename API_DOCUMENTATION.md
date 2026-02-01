# University Marketplace API Documentation

This document outlines the available REST API endpoints for the University Marketplace application, organized by entity.

---

## 1. User Controller
**Base URL:** `/api/v1/user`

1.  **Register User**
    *   **Endpoint:** `POST /register`
    *   **Description:** Registers a new user (student) with email, password, and basic details.
    *   **Body:** `UserRegisterDTO`
    ```json
    {
      "email": "student@uni.edu",
      "password": "strongPassword123",
      "role": "STUDENT",
      "fullName": "John Doe",
      "phone": "0771234567",
      "universityId": "S123456",
      "department": "Computer Science",
      "batch": "2024"
    }
    ```

2.  **Login User**
    *   **Endpoint:** `POST /login`
    *   **Description:** Authenticates a user and returns user details (or token).
    *   **Body:** `LoginDTO`
    ```json
    {
        "email": "student@uni.edu",
        "password": "strongPassword123"
    }
    ```

3.  **Get User Profile**
    *   **Endpoint:** `GET /profile/{id}`
    *   **Description:** Retrieves the detailed profile of a specific user.

4.  **Update Profile**
    *   **Endpoint:** `PUT /profile/update`
    *   **Description:** Updates the profile information of an existing user.
    *   **Body:** `UserProfile`
    ```json
    {
        "userId": 1,
        "fullName": "John Doe Updated",
        "phone": "0777654321",
        "universityId": "S123456",
        "department": "Software Engineering",
        "batch": "2024",
        "avatarUrl": "http://example.com/image.jpg"
    }
    ```

---

## 2. Product Controller
**Base URL:** `/api/v1/product`

1.  **Add Product**
    *   **Endpoint:** `POST /add`
    *   **Description:** Creates a new product listing.
    *   **Body:** `ProductDTO`
    ```json
    {
        "sellerId": 1,
        "categoryId": 2,
        "title": "Calculus Textbook",
        "description": "Used widely in first year engineering.",
        "price": 1500.00,
        "condition": "USED_GOOD",
        "location": "Main Library",
        "contactPhone": "0771234567",
        "imageUrls": ["http://example.com/book1.jpg", "http://example.com/book2.jpg"]
    }
    ```

2.  **List All Products**
    *   **Endpoint:** `GET /list`
    *   **Description:** Retrieves a list of all available products.

3.  **Get Products by Category**
    *   **Endpoint:** `GET /category/{categoryId}`
    *   **Description:** Retrieves all products belonging to a specific category.

4.  **Get Product Details**
    *   **Endpoint:** `GET /{id}`
    *   **Description:** Retrieves detailed information about a specific product by its ID.

5.  **Delete Product**
    *   **Endpoint:** `DELETE /delete/{id}`
    *   **Description:** Removes a product listing from the system.

6.  **Update Product**
    *   **Endpoint:** `PUT /update`
    *   **Description:** Updates the details of an existing product.
    *   **Body:** `ProductDTO`
    ```json
    {
        "productId": 10,
        "sellerId": 1,
        "categoryId": 2,
        "title": "Calculus Textbook - Updated",
        "description": "Price negotiable.",
        "price": 1200.00,
        "condition": "USED_LIKE_NEW",
        "location": "Canteen",
        "contactPhone": "0771234567"
    }
    ```

---

## 3. Category Controller
**Base URL:** `/api/v1/category`

1.  **Create Category**
    *   **Endpoint:** `POST /create`
    *   **Description:** Adds a new product category.
    *   **Body:** `CategoryDTO`
    ```json
    {
        "name": "Electronics",
        "parentId": null
    }
    ```

2.  **List All Categories**
    *   **Endpoint:** `GET /list`
    *   **Description:** Retrieves a list of all product categories.

---

## 4. Chat Controller
**Base URL:** `/api/v1/chat`

1.  **Send Message**
    *   **Endpoint:** `POST /send`
    *   **Description:** Sends a message from one user to another regarding a product.
    *   **Body:** `MessageDTO`
    ```json
    {
        "senderId": 1,
        "receiverId": 5,
        "productId": 10,
        "content": "Is this still available?"
    }
    ```

2.  **Get Messages**
    *   **Endpoint:** `GET /messages/{conversationId}`
    *   **Description:** Retrieves the chat history for a specific conversation.

3.  **Get User Conversations**
    *   **Endpoint:** `GET /conversations/{userId}`
    *   **Description:** Retrieves a list of all active conversations for a specific user.

---

## 5. Image Controller
**Base URL:** `/api/v1/image`

1.  **Upload Image**
    *   **Endpoint:** `POST /upload`
    *   **Description:** Uploads an image file and returns its access URL.
    *   **Request Part:** `file` (MultipartFile)
    *   **Note:** This is a `multipart/form-data` request, not JSON.

---
