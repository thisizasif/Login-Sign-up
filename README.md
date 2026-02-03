<div align="center">

# 🔐 Firebase Authentication UI

**A sleek, modern authentication system with zero backend code required**  
*Login • Signup • Password Reset • Google OAuth • Email Verification*

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**✨ Live Demo • 📱 Responsive • 🚀 No Build Step • 🔧 Easy Setup**

[![Demo](https://img.shields.io/badge/TRY_DEMO-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

</div>

---

## 🚀 Quick Start

### 1. **Get Firebase Config**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project → Enable **Email/Password** & **Google** auth
3. Add web app → Copy config

### 2. **Configure**
```javascript
// 📁 auth.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};
```


### 3. **Update redirect after login**
```bash
window.location.href = "/dashboard/index.html";
```


### 3. **Firestore Security Rules**
```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users manage their own profile
    match /users/{userId} {
      allow read, create, update, delete:
        if request.auth != null && request.auth.uid == userId;
    }

    // Public config read
    match /config/{document} {
      allow read: if true;
      allow write: if false;
    }

    // Temporary mobile auth support
    match /auth-test/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
";
```
---

## ✨ Features

| | |
|--|--|
|✅| **Email/Password** login & signup|
|✅| **Google Sign-In** (popup/redirect)|
|✅| **Email verification** & password reset|
|✅| **Persistent sessions** (Firebase LOCAL)|
|✅| **Mobile-responsive** design|
|✅| **Real-time validation** & error handling|
|🚫| **No backend required**|

---

## 📁 Files

```
/auth
├── auth.html      # Main page
├── auth.css       # Styles (customizable)
└── auth.js        # Firebase logic
```

---

## 🎨 Customize

```css
/* Change colors in auth.css */
:root {
  --primary-color: #4285f4;    /* Main color */
  --secondary-color: #34a853;  /* Success color */
  --error-color: #ea4335;      /* Error color */
}
```

---


## 📱 Responsive

| Device | Layout | Google Auth |
|--------|--------|-------------|
| Desktop (>850px) | Two-panel | Popup |
| Mobile | Full-screen | Redirect |

---

## ⚠️ Important

1. **Add domain** in Firebase Console → Authentication → Authorized Domains
2. **Customize** email templates in Firebase Console
3. **Secure** your Firestore/Firebase with proper rules

---

## 📄 License

MIT © 2023 - Free to use, modify, and distribute

---

<div align="center">

**Need help?** Open an issue • **Like it?** ⭐ Star the repo

👨‍💻 Author

Created by thisizasif

If this project helped you:

<a href="https://www.buymeacoffee.com/thisizasif"> <img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" /> </a>
</div>
