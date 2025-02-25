import jwt from "jsonwebtoken";

// signs a payload of data and sends it as a JWT-AUTH cookie
export function signSendJWT(response, payload) {
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 10800000 });

  response.cookie("jwt-auth", token, {
    httpOnly: true, secure: true, sameSite: "None", maxAge: 10800000 
  });
}

// verifies that the JWT token exists and extracts the user's id
export async function verifyJWT(request) {
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