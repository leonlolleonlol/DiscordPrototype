
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";

const Chat = () => {
  const { userData } = useUserStore();

  let email = "guest";
  if (userData)
    email = userData.email;

  return (
    <div>
      Welcome {email}
    </div>
    
  )
}
  
export default Chat;
