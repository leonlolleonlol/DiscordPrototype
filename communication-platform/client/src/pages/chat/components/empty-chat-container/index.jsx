import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils"; // Make sure the import path is correct

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-[#1c1d25] duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <p>No messages yet</p>
        <p>Start a conversation now!</p>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
