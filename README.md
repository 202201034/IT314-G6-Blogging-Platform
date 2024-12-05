

# **BlogX**

Welcome to **BlogX**, a . BlogX is a feature-rich and responsive website designed to provide users with an engaging and intuitive blogging experience. With robust user authentication, personalized recommendations, interactive features, and dynamic content, the platform aims to connect readers and writers seamlessly.


---

## Features  

### 🔐 **Authentication**:
- User registration and login using Firebase Authentication.
- Google Sign-In functionality for quicker access.
- Password reset feature with email verification.

---

### 📧 **Password Reset**:
- Forgot your password? Simply provide your registered email, and we’ll send you a secure reset link.
- Reset password functionality with validation.

---

### 📬 **Email Integration**:
- Welcome emails to new users.
- Password reset emails via EmailJS.

---


### **Homepage**
- **Recommended Blogs**: Displays blogs tailored to user interests based on activity and preferences.
- **Search Blogs**: Users can search for blogs by title, tags, or author with instant results.  
- **Dynamic Feed**: Showcases popular, trending, and recent blogs for a diverse content experience.

---

### **Blog Features**
- **Read Blogs**: Detailed blog pages with rich text formatting and images.  
- **Like & Comment**: Users can express their appreciation and engage in discussions by liking and commenting on blogs.  
- **Reply to Comments**: Facilitate threaded conversations by replying to existing comments.  
- **Share Blogs**: Share blogs via links or social media platforms.  
- **Save Blogs**: Bookmark blogs to access them later in a dedicated saved blogs section.  
- **Write Blogs**: A rich-text editor to create and publish content, with support for adding images and links.  
- **Draft Blogs**: Save incomplete blogs as drafts to finish and publish later.  
- **Edit Blogs**: Make updates or corrections to previously published or saved blogs.

---

### **Profile Features**
- **User Profile**: Displays user details, including profile picture, bio, followers, following, and published blogs.  
- **Follow Profiles**: Follow other users to see their blogs and activities on your feed.  
- **Saved Blogs**: Access blogs you’ve saved for later.  
- **Notification System**:  
  - Alerts for likes on your blogs.  
  - Notifications for new comments on your blogs.  
  - Updates for replies to your comments.  
  - Alerts for new followers.

---

### **Additional Functionalities**
- **Blog Management**:  
  - Maintain drafts for unpublished blogs.  
  - Edit or delete saved and published blogs as needed.  
- **Real-time Updates**: Notifications and dynamic feed updates for a seamless user experience.

---

## Usage  
1. **Browse Blogs**: Visit the homepage to explore recommended and trending blogs.  
2. **Engage with Content**: Like, comment, share, or save blogs.  
3. **Write Your Blog**: Use the blog editor to draft, save, and publish your articles.  
4. **Manage Your Profile**: Update your bio, follow users, and review your activity.  
5. **Stay Notified**: Receive updates on interactions with your content.

---

## Technologies Used  
- **Frontend**: React.js, Next.js, Tailwind CSS, Framer Motion for animations.  
- **Backend**: Firebase Authentication and Firestore Database for secure data handling.  
- **Email Integration**: EmailJS for sending notifications and welcome emails.

---

This platform ensures a smooth and enriched blogging experience with advanced functionality and engaging user interaction. Enjoy blogging like never before!
---

## **Installation and Setup**

1. Clone this repository:
   ```bash
   git clone https://github.com/202201034/IT-G6-Blogging-Platform.git
   ```

2. Navigate to the project directory:
   ```bash
   cd your-repo-name
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up Firebase:
   - Create a Firebase project on [Firebase Console](https://console.firebase.google.com/).
   - Enable Email/Password and Google Sign-In authentication.
   - Download and configure the `firebaseConfig` in `/firebase/firebase.js`.

5. Set up EmailJS:
   - Sign up on [EmailJS](https://www.emailjs.com/).
   - Configure your service ID, template ID, and user ID.
   - Replace placeholders in the code.

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open your browser and go to:
   ```
   http://localhost:3000
   ```

---
## **Contributing**

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## **License**

This project is licensed under the Apache 2.0 License. See the `LICENSE` file for details.

---

## **Contact**

For questions or feedback, reach out to us:
- **Email**: blogxplatform@gmail.com
- **Website**: [BlogX](https://it-314-g6-blogging-platform.vercel.app/)
