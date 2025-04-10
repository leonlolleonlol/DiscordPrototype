# Communication Platform

## Project Description

This project aims to develop a dynamic communication platform that facilitates seamless interactions through text channels and direct messaging. Inspired by platforms like Discord and Slack, it enables users to collaborate with teams, engage with communities, and have private conversations with friends. The platform provides a structured and user-friendly environment for communication, featuring topic-based channels, media sharing, and private chats. With an intuitive design and strong privacy controls, it fosters efficient and meaningful interactions.

## Team Members

| Name              | Student Number | GitHub Username |
| ----------------- | -------------- | --------------- |
| Ammar Ranko       | 40281232       | ammarranko      |
| Ryan Cheung       | 40282200       | RyanCheung03    |
| Matthew Leprohon  | 40283413       | mattlep11       |
| Leon Kojakian     | 40282267       | leonlolleonlol  |
| German Shevchenko | 40246785       | gShevc          |
| Massimo Paolini   | 40280323       | MassPaol        |
| Peter Rentopoulos | 40123208       | beterbuilds     |

## Core Features

### 1. Text Channels for Group Communication

- Users can join and leave channels.
- Messages sent in a channel are visible to all users in that channel.
- Users can post their messages.

### 2. Direct Messaging Between Users

- Users can initiate one-on-one conversations with other members.
- Private messages are only visible to the participants.

### 3. Role-Based User Permissions

- **Admin Role:**
  - Can create and delete group chat channels.
  - Can modify the permissions of existing users by making them into admins.
  - Can moderate messages by deleting inappropriate content.
- **Member Role:**
  - Can join and participate in channels.
  - Can send and view messages.

### 4. Additional Feature: AI-Powered Enhancement

- **Auto-Moderation:**
  - AI will detect and flag inappropriate or harmful content for removal.

## Technologies & Techniques
This project leverages a modern web development stack for a responsive, real-time, and maintainable application:

- **Frontend:**
  - [React](https://reactjs.org/) – Component-based UI library  
  - [Vite](https://vitejs.dev/) – Fast build tool and development server  
  - [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
  - [ShadCN UI](https://ui.shadcn.dev/) – Styled component library built on Radix UI and Tailwind  
  - [Radix UI](https://www.radix-ui.com/) – Accessible UI primitives for React  
  - [Zustand](https://zustand-demo.pmnd.rs/) – Lightweight state management  

- **Backend & Real-Time:**
  - [Socket.IO](https://socket.io/) – Real-time bi-directional communication  
  - [MongoDB](https://www.mongodb.com/) – NoSQL database for flexible data storage  

- **Networking & Data Handling:**
  - [Axios](https://axios-http.com/) – Promise-based HTTP client for the browser and Node.js


## Installation & Setup

1. Download the repository.
2. Navigate to the client directory in one terminal and the server directory in two other terminals.
3. Run the terminal command "npm i" in the client directory and one of the server directories.
4. Place both .env files in their respective file directory (client or server).
5. Download "distilbert_final_model" from "Toxicity Classifier - v1.0" and place the "model.safetensors" file in the "toxicity_final_model" directory.
6. Run the terminal command "npm run dev" in the client directory and again in one of the server directories.
7. Run the terminal command "npm run py_setup" in the other server directory, then run "npm run py_run" in that same directory.
8. Navigate to "http://localhost:5173/" in your browser to run the project locally.

## Contribution Guidelines

- Clone the repository.
- Create a new branch for your feature.
- Submit a pull request with a clear description of changes.
- Follow the coding style guidelines established by the team.

## License

This project is for educational purposes and does not yet have an official license.


