import { Router } from "express";
import userModel from "./models/user.js";

export const router = new Router();

// https://regex101.com/r/lHs2R3/1
const EMAIL_PATTERN = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

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

router.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, confirm } = req.body;
    
    // redo input validation on the server side
    if (email.length === 0 || password.length === 0 || confirm.length === 0) {
      res.status(400).json({ message: "All fields must be filled." });
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      res.status(400).json({ message: "Invalid email address format (email@address.dom)." });
      return;
    }
    if (password !== confirm) {
      res.status(400).json({ message: "Passwords do not match." });
      return;
    }
    
    // verify the email isn't already in use by another account
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (user) {
      res.status(400).json({ message: "Email is already in use." });
      return;
    }

    /* hash password before adding to the db for added security */

    const newUser = new userModel({
      email: email,
      password: password
    });

    try {
      await newUser.save();
      console.log(`New user saved: ${email}.`);

      /* open new user session - sign JWT token */
      /* send JWT token to user as a secure cookie */

      // sign up successful
      res.status(200).json({ message: "Sign-up successful." });
    }
    catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Failed to create user profile, please try again later." });
    }

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Something went wrong with the server. Please try again later.' });
  }
});