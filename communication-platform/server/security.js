import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export { signSendJWT, verifyJWT, hashPassword, verifyPasswordHash };