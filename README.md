# **E-Commerce Chatbot with Next.js and Python Backend**

## **Overview**  
This project is an AI-powered **e-commerce chatbot** built using **Next.js** for the frontend and a **Python backend** for AI-based interaction, authentication and data processing. The chatbot enables users to browse products, manage their accounts, and interact with an intelligent recommendation system.  

## **Features**  
- **User Authentication**  
  - Sign up and login using credentials  
  - JWT-based session management  
  - Middleware to protect routes  
- **Chatbot Interface**  
  - Real-time communication with AI-powered chatbot  
  - Quick replies and interactive suggestions  
- **Product Management**  
  - Fetch products from the database  
  - View product details and recommendations  
- **Order Management**  
  - Track order history  
  - Manage wishlists  
  - Add products to orders  
- **Settings & Customization**  
  - Dark mode support  
  - Profile management  

## **Tech Stack**  
### **Frontend**  
- **Next.js** (React Framework)  
- **TailwindCSS** (UI Styling)  
- **WebSockets** (Real-time chat)  
- **NextAuth.js** (Authentication)  
- **MongoDB** (User and product data)  
- **Redux** (State management)  

### **Backend**  
- **Python (FastAPI/Django)**  
- **Machine Learning Models**  

## **Installation & Setup**  
### **Prerequisites**  
- **Node.js** (v18+)  
- **Python** (v3.8+)  
- **MongoDB**  

### **Backend Setup**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/DReaper55/BookingChatbot.git
   cd ecommerce-chatbot/backend
   ```
2. Create a virtual environment and install dependencies:  
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set environment variables:  
   - `DATABASE_URL` (MongoDB Connection String)  
   - `SECRET_KEY` (JWT Secret)  
4. Start the backend server:  
   ```bash
   uvicorn app.main:app --reload
   ```

### **Frontend Setup**  
1. Navigate to the frontend directory:  
   ```bash
   cd ../frontend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Create a `.env.local` file and configure the following:  
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_SESSION_SECRET=your_secret_key
   ```
4. Run the development server:  
   ```bash
   npm run dev
   ```

## **Authentication & Middleware**  
- **JWT-based Authentication**  
  - Users log in via the Python backend, which issues an access token.  
  - The token is stored in cookies for secure session management.  
- **Middleware for Route Protection**  
  - Protected routes redirect unauthorized users to the login page.  

## **Deployment**  
### **Frontend Deployment (Vercel)**  
1. Install the Vercel CLI:  
   ```bash
   npm install -g vercel
   ```
2. Deploy to Vercel:  
   ```bash
   vercel
   ```
3. Set up environment variables on Vercel dashboard.  

### **Backend Deployment (AWS/GCP/Render)**  
1. Deploy FastAPI on AWS/GCP/Render using Docker.  
2. Configure database and environment variables.  
3. Use a reverse proxy (Nginx) to manage requests.  

## **Project Structure**  
```
ecommerce-chatbot/
│── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── routes/
│   ├── requirements.txt
│── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── store/
│   │   │   ├── signup/
│   │   │   ├── products/
│   │   ├── styles/
│   ├── package.json
│   ├── next.config.js
│── README.md
```

## **Contributing**  
Contributions are welcome! Please follow these steps:  
1. Fork the repository.  
2. Create a new branch (`feature-branch`).  
3. Commit your changes with clear messages.  
4. Open a pull request for review.  

## **License**  
This project is licensed under the MIT License.