# 🎓 Student Registration System Frontend

A modern web application built with **Next.js** and **Tailwind CSS** that provides a user-friendly interface for student registration and management.

## 🌐 Live Demo

Hosted on [Vercel](https://student-registration-app.vercel.app/)

---

## 🧰 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **API Calls:** Axios
- **Authentication:** JWT (with Google & GitHub OAuth)
- **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these steps to run the frontend project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/munezero-grace/student-registration-app.git
cd student-registration-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root directory:

```env
NEXT_PUBLIC_API_URL=<Your Backend API URL>
```

### 4. Running the Application

Start the development server:

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📋 Project Structure

```
student-registration-app/
├── src/
│   ├── app/            # App router pages
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility functions
│   ├── hooks/          # Custom React hooks
│   └── styles/         # Global styles
├── public/             # Static files
├── next.config.ts      # Next.js configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎯 Features

- **Responsive Design:** Mobile-friendly interface with Tailwind CSS
- **Authentication:** Secure login with JWT, Google and GitHub OAuth options
- **Student Registration:** User-friendly forms with validation
- **Admin Dashboard:** Interface for managing student records
- **Profile Management:** Students can view and update their details

## 🎨 UI Components

- Login and Registration Forms
- Admin Dashboard
- Student Profile View
- Navigation Menu
- Toast Notifications
- Loading States
- Form Validations

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

## 🚧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 💡 Contributing

Feel free to fork the repository, create a new branch, and submit a pull request for any UI/UX improvements or frontend fixes.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
