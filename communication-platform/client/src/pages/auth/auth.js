import { toast } from "sonner";
import axios from "axios";

// axios object to send requests to the server
const clientRequest = axios.create({baseURL: import.meta.env.VITE_SERVER_URL});
const SUP_ROUTE = "auth/signup";
const SIN_ROUTE = "auth/signin";

// perform client-side verification on user input and post the server for signin
export const handleLogin = async (email, password) => {
  // verify fields are non-empty
  if (email.length === 0 || password.length === 0) {
    toast.error("You must enter an email and password.");
    return false;
  }

  // post request to the server to authenticate sign-in
  try {
    const resp = await clientRequest.post(SIN_ROUTE, { email, password });
    console.log(resp.data.message);

    return resp.status === 200;
  }
  catch (err) {
    let status = err.response;
      if (status) {
        console.log(`(${status.status}) ${status.statusText}: ${status.data.message}`);
        toast.error(status.data.message);
      }
      else {
        toast.error('Server was unresponsive. Please try again later.');
      }

      return false;
  }
};

export const handleSignup = async (email, password, confirm) => {
  // verify fields are non-empty
  if (email.length === 0 || password.length === 0 || confirm.length === 0) {
    toast.error("Please fill all fields to continue.");
    return;
  }
};