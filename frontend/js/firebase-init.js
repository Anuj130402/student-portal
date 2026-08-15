const firebaseConfig = {
  apiKey: "AIzaSyA9DxhMRh6R5UMIPUB7x7_Pa3FuJPig-0g",
  authDomain: "my-cat-quiz-app-6c2f7.firebaseapp.com",
  projectId: "my-cat-quiz-app-6c2f7",
  storageBucket: "my-cat-quiz-app-6c2f7.firebasestorage.app",
  messagingSenderId: "953652853889",
  appId: "1:953652853889:web:4b49c2bf7fbcbafcbc6180"
};


firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();