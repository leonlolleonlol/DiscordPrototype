import Avatar from "@/assets/avatars.png";
import Cool from "@/assets/cool.svg";
import Background from "@/assets/login.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/lib/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin, handleSignup } from "./auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sliderValue, setSliderValue] = useState(1); // Default value 50
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { setUserData } = useUserStore();

  // redirect the user to the chat landing page if sign-in is successful
  const login = async () => {
    let user = await handleLogin(email, password);
    if (user) {
      setUserData(user);
      navigate("/chat");
    }
  };

  // redirect the user to the profile creation screen if credentials are valid
  const signup = async () => {
    let user = await handleSignup(sliderValue, firstName, lastName, email, password, confirmPassword);
    if (user) {
      setUserData(user);
      navigate("/profile");
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className=" h-[100vh] bg-amber-50 border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-4xl font-bold md:text-5xl">Welcome</h1>
              <img src={Cool} alt="Cool Emoji" className="h-[55px]" />
            </div>
            <p className='font-medium text-center'>Create your account and let&apos;s get talkin&apos;!</p>
          </div>
          <div className='flex items-center justify-center w-full'>
            <Tabs className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value='login'
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:fontsemibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
                <TabsTrigger
                  value='signup'
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:fontsemibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Signup</TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={() => login()}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-3"
                value="signup">
                <img src={Avatar} alt="avatars" className="h-13" />
                <Slider
                  value={[sliderValue]}
                  onValueChange={(value) => setSliderValue(value[0])}
                  min={1}
                  max={6}
                  step={1}
                />

                <h6 className='text-xs md:text-xs'>Selected Avatar : #{sliderValue}</h6>
                <Input
                  placeholder="First Name"
                  type="firstName"
                  className="rounded-full p-6"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  placeholder="Last Name"
                  type="lastName"
                  className="rounded-full p-6"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-s">Password Criteria: 10 or more characters, at least one number, symbol, and uppercase letter.</p>
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={() => signup()}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="background login" className="h-[600px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
