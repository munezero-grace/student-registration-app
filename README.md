# 🎓 Student Registration System

A web application built with **Next.js** and **Tailwind CSS** that allows students to register and log in using secure authentication. Admins can manage student records and user roles. The system supports both traditional registration and OAuth login (Google & GitHub).

## 🌐 Live Demo

Hosted on [Vercel](https://student-registration-app.vercel.app/)

---

## 🧰 Tech Stack

- **Frontend:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **API Calls:** Axios
- **Authentication:** JWT (with Google & GitHub OAuth)
- **Backend:** Node.js, Express, PostgreSQL (hosted on Neon)
- **Deployment:** Vercel (Frontend), Render/Heroku/Custom for backend

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/munezero-grace/student-registration-app.git
cd student-registration-app
```



### 2. Install Dependencies

#### Frontend (Next.js)
Navigate to the `frontend` directory and install the required dependencies:


```bash
cd frontend
npm install
```


#### Backend (Node.js/Express)
Navigate to the `backend` directory and install the required dependencies:


```bash
cd ../backend
npm install
```



### 3. Set Up Environment Variables

Create a .env file in both the frontend and backend directories and add the necessary environment variables:

**Frontend (.env file in the frontend directory):**

```env
NEXT_PUBLIC_API_URL=<Your Backend API URL>
```



**Backend (.env file in the backend directory):**
```env
PORT=5000
DATABASE_URL=<Your PostgreSQL database URL> 
JWT_SECRET=<Your JWT secret key> 
```



### 4. Running the Application

#### Frontend:
Start the frontend development server:

```bash
cd frontend
npm run dev
```


#### Backend:
Start the backend server (you can use npm start or nodemon):

```bash
cd backend
npm start
```

Once both servers are running:

Frontend: http://localhost:3000

Backend: http://localhost:5000 




### 5.📝 API Documentation

The following endpoints are available:

- **POST /api/register**: Register a new student (email, password, firstName, lastName, dateOfBirth).
- **POST /api/login**: Login a user (email and password).
- **GET /api/profile**: Fetch the logged-in student's profile (JWT protected).
- **GET /api/admin/users**: List all users (admin access only).
- **PUT /api/admin/users/:id**: Update a registered user (admin access only).
- **DELETE /api/admin/users/:id**: Delete a registered user (admin access only).






### 6.📋 Project Structure

The project is organized into two main directories:

- **frontend/**: Contains the Next.js application (client-side).
- **backend/**: Contains the Node.js/Express API (server-side).





### 7.🎯 Features

- JWT Authentication with Google and GitHub OAuth
- Admin Dashboard for managing users
- Unique Registration Numbers (e.g., REG-xxxx-2025)
- Responsive UI built with Tailwind CSS




### 8.✅ Testing

- Test API endpoints with tools like Postman or Insomnia:
  - Registration: POST /api/register
  - Login: POST /api/login
  - Profile Access: GET /api/profile (JWT token required)
  - Admin User Management: 
    - GET /api/admin/users  
    - PUT /api/admin/users/:id  
    - DELETE /api/admin/users/:id




### 9.🚧 Contributions

Feel free to fork the repository, create a new branch, and submit a pull request for any improvements or fixes. Contributions are welcome!



### 10.💡 Bonus Features

- Environment variable usage for sensitive data
- Swagger API documentation integration (swagger-jsdoc or swagger-ui-express)
- Unit testing (Jest) for backend and frontend
- Paginated user display for the admin dashboard

### 📄 License

This project is licensed under the [MIT License](LICENSE).