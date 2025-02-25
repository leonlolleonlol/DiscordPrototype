import { toast } from "sonner";
import axios from "axios";

// axios object to send requests to the server
const clientRequest = axios.create({baseURL: import.meta.env.VITE_SERVER_URL});
const SUP_ROUTE = "auth/signup";
const SIN_ROUTE = "auth/signin";

// https://regex101.com/r/lHs2R3/1
const EMAIL_PATTERN = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

// sends a post request to a destination route, returns true if status 200
async function postAuth(dest, param) {
  try {
    const resp = await clientRequest.post(dest, param);
    console.log(resp.data.message);

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
  if (email.length === 0 || password.length === 0) {
    toast.error("You must enter an email and password.");
    return false;
  }

  // post request to the server to authenticate sign-in
  return postAuth(SIN_ROUTE, { email, password });
};

// perform client-side verification on user input and post the server for signup
export const handleSignup = async (email, password, confirm) => {
  // verify fields are non-empty
  if (email.length === 0 || password.length === 0 || confirm.length === 0) {
    toast.error("Please fill all fields to continue.");
    return false;
  }
  // ensure email matches proper format
  if (!EMAIL_PATTERN.test(email)) {
    toast.error("Invalid email address format (email@address.dom).");
    return false;
  }
  // passwords match
  if (password !== confirm) {
    toast.error("Passwords do not match.");
    return false;
  }

  // post request to the server to authenticate sign-up credentials
  return postAuth(SUP_ROUTE, { email, password, confirm });
};