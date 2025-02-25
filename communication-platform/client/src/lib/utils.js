import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// axios object to send requests to the server
export const clientRequest = axios.create(
  {baseURL: import.meta.env.VITE_SERVER_URL, withCredentials: true});
