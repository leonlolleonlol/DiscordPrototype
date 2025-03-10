import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import animationData from "@/assets/lottie-json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// axios object to send requests to the server
export const clientRequest = axios.create(
  {baseURL: import.meta.env.VITE_SERVER_URL, withCredentials: true}
);

export const animationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData: animationData
};