import { toast } from "sonner";
import { clientRequest } from "@/lib/utils";
import { fieldsNotEmpty, validatePassword } from "~/validation.js"

const SUP_ROUTE = "auth/signup";
const SIN_ROUTE = "auth/signin";
const SOUT_ROUTE = "auth/signout";

// https://regex101.com/r/lHs2R3/1
const EMAIL_PATTERN = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

// sends a post request to a destination route, returns true if status 200
async function postAuth(dest, param) {
  try {
    const resp = await clientRequest.post(dest, param);
    return resp.status === 200 ? resp.data.user : false;
  }
  catch (err) {
    let status = err.response;
      if (status) {
        console.log(`(${status.status}) ${status.statusText}: ${status.data.message}`);
        toast.error(status.data.message);
      }
      else {
        toast.error("Server was unresponsive. Please try again later.");
      }

      return false;
  }
}

// perform client-side verification on user input and post the server for signin
export const handleLogin = async (email, password) => {
  // verify fields are non-empty
  if (!fieldsNotEmpty(email, password)) {
    toast.error("You must enter an email and password.");
    return false;
  }

  // post request to the server to authenticate sign-in
  return postAuth(SIN_ROUTE, { email, password });
};

// perform client-side verification on user input and post the server for signup
export const handleSignup = async (avatarId, fName, lName, email, password, confirm) => {
  // verify fields are non-empty
  if (!fieldsNotEmpty(fName, lName, email, password, confirm)) {
    toast.error("Please fill all fields to continue.");
    return false;
  }
  // ensure email matches proper format
  if (!EMAIL_PATTERN.test(email)) {
    toast.error("Invalid email address format (email@address.dom).");
    return false;
  }
  if (!validatePassword(password)) {
    toast.error("Password does not meet criteria.");
    return false;
  }
  // passwords match
  if (password !== confirm) {
    toast.error("Passwords do not match.");
    return false;
  }

  const payload = { avatarId, fName, lName, email, password, confirm };

  // post request to the server to authenticate sign-up credentials
  return postAuth(SUP_ROUTE, payload);
};

export const handleSignout = async () => {
  return postAuth(SOUT_ROUTE);
}
