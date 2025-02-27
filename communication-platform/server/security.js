import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "./models/user.js";
import { fieldsNotEmpty, validatePassword } from "../shared/validation.js";

// https://regex101.com/r/lHs2R3/1
const EMAIL_PATTERN = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

// signs a payload of data and sends it as a JWT-AUTH cookie
function signSendJWT(response, payload) {
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 10800000 });

  response.cookie("jwt-auth", token, {
    httpOnly: true, secure: true, sameSite: "None", maxAge: 10800000 
  });
}

// verifies that the JWT token exists and extracts the user's id
async function verifyJWT(request) {
  const token = request.cookies['jwt-auth'];
  if (!token)
    return false;

  let id = false;

  // extract the id if it exists
  jwt.verify(token, process.env.JWT_KEY, async(err, payload) => {
    if (!err) 
      id = payload.id;
  });

  return id;
}

// creates a hash for the password and assigns it to the userModel
async function hashPassword(pass) {
  return bcrypt.hash(pass, Number(process.env.SALT_ROUNDS))
    .catch(err => {
      console.log("Failed securing password: " + err.message);
      return false;
    });
}

// compares the plain text password with the hash to ensure they match
async function verifyPasswordHash(pass, hash) {
  return bcrypt.compare(pass, hash)
    .catch(err => {
      console.log("Failed comparing passwords: " + err.message);
      return undefined;
    })
}

// performs input validation and password checking to okay a sign-in
async function authenticateSignIn(email, password) {
  let message = "Sign-in successful.";
  let status = 200;

  // redo input validation on the server side
  if (!fieldsNotEmpty(email, password)) {
    status = 400;
    message = "An email and password are required to sign-in.";
    return { status, message, user }; // early exit if fields aren't satisfied
  }
  
  // query to check if the email exists and passwords match
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    status = 400;
    message = "Invalid email address.";
  }

  // verify password matches against the hash stored in the database
  if (user) {
    const passMatches = await verifyPasswordHash(password, user.password);
    if (passMatches == undefined) {
      status = 500;
      message = "Failed to authenticate password, please try again later."
    }
    else if (!passMatches) {
      status = 400;
      message = "Password is incorrect.";
    }
  }

  return { status, message, user };
}

// performs input validation and email use checking to okay a sign-up
async function authenticateSignUp(avatarId, fName, lName, email, password, confirm) {
  let message = "Sign-up successful.";
  let status = 200;

  // redo input validation on the server side
  if (!fieldsNotEmpty(avatarId, fName, lName, email, password, confirm)) {
    status = 400;
    message = "All fields must be filled.";
  }
  else if (!EMAIL_PATTERN.test(email)) {
    status = 400;
    message = "Invalid email address format (email@address.dom)."
  }
  else if (!validatePassword(password)) {
    status = 400;
    message = "Password does not meet criteria.";
  }
  else if (password !== confirm) {
    status = 400;
    message = "Passwords do not match.";
  }

  // verify the email isn't already in use by another account
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (user) {
    status = 400;
    message - "Email is already in use.";
  }

  return { status, message };
}

export { 
  signSendJWT, verifyJWT, hashPassword, authenticateSignIn, authenticateSignUp 
};
