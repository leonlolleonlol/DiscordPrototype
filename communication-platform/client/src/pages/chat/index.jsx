import { useUserStore } from "@/lib/store";

const Chat = () => {
  const { userData } = useUserStore();

  let email = "guest";
  let fname = "John", lname = "Doe", avatarId = -1;
  if (userData) {
    email = userData.email;
    fname = userData.firstName;
    lname = userData.lastName;
    avatarId = userData.avatar;
  }

  return (
    <div>
      Welcome {email}.
      <br />
      Your name is {fname} {lname}.
      <br />
      You selected avatar {avatarId}.
    </div>
    
  )
}
  
export default Chat;
