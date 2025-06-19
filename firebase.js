var admin = require("firebase-admin");
require("dotenv").config({path:"./config.env"});


admin.initializeApp({
  credential: admin.credential.cert({
     "type": process.env.FIREBASE_TYPE,
  "project_id":process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri":process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT,
  "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
  })
});



const db = admin.firestore();
module.exports = { admin, db };






















// // Import the functions you need from the SDKs you need
// const { initializeApp } =require("firebase/app") ;
// const { getFirestore } =require("firebase/firestore");
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {

//   apiKey:process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
 
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db=getFirestore(app)
// module.exports={app,db}