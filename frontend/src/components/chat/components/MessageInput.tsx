import { useCallback, useRef } from "react";
import SendButton from "../assets/button.webp";

interface Props {
  onSend: (msg: string) => void;
}

const MessageList = ({ onSend }: Props) => {
  const msg = useRef<HTMLInputElement | null>(null);
  const senMessage = useCallback(() => {
    if (msg.current !== null && msg.current.value) {
      onSend(msg.current.value);
      msg.current.value = "";
    }
  }, []);
  return (
    <div className="flex items-center px-5">
      <input
        ref={msg}
        maxLength={1500}
        type="text"
        className="w-full h-10 rounded-full border-2 p-2"
        style={{ borderColor: "#BACCEF" }}
        placeholder="Write your message here..."
        onKeyDown={(event) => {
          if (event.key === "Enter") senMessage();
        }}
      />
      <button className="" onClick={senMessage}>
        <img src={SendButton} alt="sendButton" />
      </button>
    </div>
  );
};

export default MessageList;
