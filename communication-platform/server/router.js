import { Router } from "express";
import userModel from "./models/user.js";
import * as check from "./security.js";

export const router = new Router();

// handle http requests to the server

router.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // server-side input validation to authenticate the sign-in
    const { status, message, user } = await check.authenticateSignIn(email, password);
    if (status > 200 || !user) {
      console.log(`Failed sign-in attempt (${email}): ${message}`);
      return res.status(status).json({ message: message });
    }

    check.signSendJWT(res, { id: user._id, email: user.email});

    // user data returned to client
    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      avatar: user.avatar,
      status: 'online',
      friends: user.friends,
      role: user.role
    };

    // sign-in successful
    await userModel.updateOne({ _id: user._id }, { $inc: { nbSessions: 1 } });
    console.log(`New user successfully signed in: ${email}`);
    res.status(status).json({ message: message, user: userData });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something went wrong with the server. Please try again later." });
  }
});

router.post('/auth/signup', async (req, res) => {
  try {
    const { avatarId, fName, lName, email, password, confirm } = req.body;
    
    let { status, message } = await check.authenticateSignUp(avatarId, fName, lName, email, password, confirm);
    if (status > 200) {
      console.log(`Failed sign-up attempt (${email}): ${message}`);
      return res.status(status).json({ message: message });
    }

    // hash password before saving the user to the db
    const hash = await check.hashPassword(password);
    if (!hash) {
      console.log(`Failed to hash password (${email}).`);
      return res.status(500).json({ message: "Failed to secure your account, please try again later." });
    }

    const newUser = new userModel({
      avatar: avatarId,
      firstname: fName,
      lastname: lName,
      email: email,
      password: hash
    });

    try {
      await newUser.save();
      console.log(`New user saved: ${email}.`);

      check.signSendJWT(res, { id: newUser._id, email: newUser.email});

      // known user data returned to client
      const userData = {
        id: newUser._id,
        avatarId, 
        firstName: fName,
        lastName: lName,
        email,
        status: 'online',
        friends: [],
        role: 'user'
      };

      // sign up successful
      res.status(status).json({ message: message, user: userData });
    }
    catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Failed to create user profile, please try again later." });
    }

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something went wrong with the server. Please try again later." });
  }
});

router.get('/profile/data', async (req, res) => {
  const id = await check.verifyJWT(req, res);

  if (!id) {
    res.status(400).json({ message: "User is not authenticated." });
    return;
  }

  const user = await userModel.findById(id);
  
  if (user) {
    // user data returned to client
    const userData = {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      avatar: user.avatar,
    };

    res.status(200).json({ message: "User session found.", user: userData });
  }
  else
    res.status(404).json({ message: "User ID not found in database."});
});
