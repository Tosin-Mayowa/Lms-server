const { db } =require("../firebase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); 



const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


// verifyUser.js
module.exports.verifyCode = async (req, res) => {
  try {
    const { phone, code } = req.body;

    const snapshot = await db.collection("users").where("phone", "==", phone).get();
    if (snapshot.empty) return res.status(404).json({ message: "User not found" });

    const doc = snapshot.docs[0];
    const user = doc.data();

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (Date.now() > user.verificationExpires) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    await doc.ref.update({
      isVerified: true,
      verificationCode: null,
      verificationExpires: null,
    });

    res.json({ message: "Phone number verified successfully." });
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
};





// submitPhone.js


module.exports.submitPhone = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ message: "Email and phone are required" });
    }

    // Query user by email
    const snapshot = await db.collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming only one user per email
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Update user document
    await userDoc.ref.update({
      phone,
      verificationCode: code,
      verificationExpires: expires,
    });

    // Send the code via SMS
    // await sendSMS(phone, code);

    res.json({ message: "Verification code sent",data:code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send verification code" });
  }
};


// register.js
module.exports.createUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existing = await db.collection("users").where("email", "==", email).get();
    if (!existing.empty) {
      return res.status(400).json({ message: "Email already exists" });
    }
const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection("users").doc();
    await userRef.set({
      id: userRef.id,
      fullname,
      email,
      password:hashedPassword, // hash in production!
      isVerified: false,
      phone: null,
      verificationCode: null,
      verificationExpires: null,
    });

    res.status(201).json({ message: "Registered successfully"});
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};


module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update isActive field
    await db.collection("users").doc(userDoc.id).update({ isActive: true });

    // Generate JWT token
    const token = generateToken(userDoc.id);
    console.log({ token });

    // Set cookie options
    const options = {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
      options.sameSite = "None"; 
    }

    // Send cookie and response
    res.cookie("jwt", token, options);
    res.status(200).json({
      token,
      status: "success",
      id: userDoc.id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
};

// module.exports.createUser = async (req, res) => {
//   try {
//     console.log(req.body);
    
//     const { fullname, email, password, isActive } = req.body;

//     const snapshot = await db.collection("users").where("email", "==", email).get();
//     if (!snapshot.empty) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate 6-digit PIN
//     const pin = Math.floor(100000 + Math.random() * 900000).toString();
//     const pinExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

//     const userRef = await db.collection("users").add({
//       fullname,
//       email,
//       password: hashedPassword,
//       isActive,
//       isVerified: false,
//       pin,
//       pinExpiresAt,
//     });

//     // TODO: Send email here
//      await sendEmail({
//       to: email,
//       subject: "Verify your iLearner account",
//       text: `Hi ${fullname},\n\nYour verification PIN is: ${pin}\n\nThis code expires in 10 minutes.`,
//     });

//     res.status(201).json({ message: "User created. Please verify your email using the 6-digit code sent." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Registration error" });
//   }
// };




