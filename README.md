# 💬 Real-Time Chat Application (WhatsApp-like)

A full-stack real-time chat application built using **React Native (Expo)**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.  
This app supports secure authentication, one-to-one chats, real-time messaging, message status ticks, edit/delete functionality, and a polished mobile UI.

---

## 🚀 Features

### 🔐 Authentication
- User Sign Up & Login
- JWT-based authentication
- Password hashing using bcrypt
- Secure token storage on device

### 👥 Users & Chats
- List of all registered users
- One-to-one chat creation
- Unique conversation per user pair
- Chat header always shows receiver name

### 💬 Messaging
- Send and receive messages
- Real-time messaging with Socket.IO
- Sender messages appear on the right
- Receiver messages appear on the left
- Auto-scroll to latest message

### ✔ Message Status
- ✔ Single tick → message sent
- ✔✔ Double tick → message seen
- Seen status updates in real time

### ✏ Message Actions
- Edit message
- Delete message for everyone
- Deleted messages show: *“This message was deleted”*
- Edited messages show *(edited)*

### 📱 UI / UX
- WhatsApp-like interface
- SafeArea support (no overlap with system navigation)
- Fixed header and footer
- Smooth scrolling
- Clean and modern design

---

## 🧠 How the App Works (End-to-End)

### 1️⃣ Authentication Flow
1. User signs up or logs in
2. Backend validates credentials
3. JWT token is generated
4. Token is stored securely on device
5. Token is attached to every API request

---

### 2️⃣ Chat Creation Flow
1. User selects another user
2. Frontend calls `/api/chats`
3. Backend:
   - Finds existing conversation OR
   - Creates a new one
4. Conversation ID is returned
5. Chat screen opens

---

### 3️⃣ Message Flow
1. User sends a message
2. Message is saved in MongoDB
3. Message is emitted via Socket.IO
4. Receiver receives message instantly
5. Sender sees ✔ tick
6. When receiver opens chat:
   - Messages marked as `seen`
   - Socket event updates sender
   - Sender sees ✔✔ tick

---

### 4️⃣ Edit & Delete Logic
- **Edit**
  - Only sender can edit
  - Message text updated in DB
  - `(edited)` label displayed

- **Delete**
  - Message replaced with placeholder text
  - Visible as deleted on both sides
  - Message alignment remains correct

---

## 🏗 Project Structure

         chat-app/
│
├── backend/
│ ├── src/
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ ├── Conversation.js
│ │ │ └── Message.js
│ │ │
│ │ ├── routes/
│ │ │ ├── auth.routes.js
│ │ │ ├── user.routes.js
│ │ │ ├── chat.routes.js
│ │ │ └── message.routes.js
│ │ │
│ │ ├── middleware/
│ │ │ └── auth.middleware.js
│ │ │
│ │ ├── socket.js
│ │ ├── app.js
│ │ └── server.js
│ │
│ └── .env
│
├── frontend/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── login.js
│ │ │ └── signup.js
│ │ │
│ │ ├── (tabs)/
│ │ │ ├── chats.js
│ │ │ ├── profile.js
│ │ │ └── _layout.js
│ │ │
│ │ ├── chat/
│ │ │ └── [id].js
│ │ │
│ │ └── _layout.js
│ │
│ ├── context/
│ │ └── AuthContext.js
│ │
│ ├── services/
│ │ ├── api.js
│ │ └── socket.js
│ │
│ └── components/
│
└── README.md


---

## 🛠 Tech Stack

### Frontend
- React Native (Expo)
- Expo Router
- Axios
- Socket.IO Client
- React Context API
- Secure Storage

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.IO
- JWT Authentication
- bcrypt

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install



        Create .env:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key


Start server:

npx nodemon src/server.js

Frontend
cd frontend
npm install
npx expo start


📌 Ensure mobile and laptop are on the same Wi-Fi
📌 Update API base URL with your local IP

🎥 Video Demo

Add your demo video link here:

https://your-video-link-here

📌 Key Learnings

Real-time communication using Socket.IO

Secure authentication with JWT

Clean frontend-backend separation

Scalable chat architecture

Handling mobile UI edge cases

🚧 Future Enhancements

Group chats

Typing indicators

Online/offline status

Message reactions

Push notifications

Media sharing

👤 Author

Om Waghchavare

Built as a full-stack learning project 🚀