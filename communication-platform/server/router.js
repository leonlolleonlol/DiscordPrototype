import { Router } from "express";
import userModel from "./models/user.js";

export const router = new Router();

// handle http requests to the server

router.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // redo input validation on the server side
    if (email.length === 0 || password.length === 0) {
      res.status(400).json({ message: "An email and password are required to sign-in." });
      return;
    }
    
    // query to check if the email exists and passwords match
    const user = await userModel.findOne({ email: email.toLowerCase() });

    /* check password against hashed password in db if user exists */

    if (!user || password !== user.password) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    /* sign JWT token */
    /* send JWT token to user via secure cookie */

    // sign-in successful
    res.status(200).json({ message: "Sign-in successful." });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Something went wrong with the server. Please try again later.' });
  }
});