import { useEffect, useRef, useState } from "react";
import { channel } from "../Channels";
import { ChannelType } from "../channel-dto";
import { Socket } from "socket.io-client";
import { MdRemoveModerator } from "react-icons/md";
import { MdChangeCircle } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

interface Props {
  join: channel | null;
  socket: Socket | null;
}
const RoomPassword = ({ socket, join }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  let status = false;
  const uname = useRef<HTMLInputElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  if (join && join.type === ChannelType.PROTECTED) {
    status = true;
  } else {
    status = false;
  }
  const handleMouseClick = (event: MouseEvent) => {
    if (
      divRef &&
      divRef.current &&
      !divRef.current.contains(event.target as Node)
    )
      setIsOpen(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleMouseClick);

    return () => {
      document.removeEventListener("mousedown", handleMouseClick);
    };
  }, []);
  const SetPassword = (message: string) => {
    if (uname.current !== null && uname.current.value) {
      const password = uname.current.value;
      if (password && socket && join) {
        socket.emit("SetPassword", { channel_id: join.room_id, password });
        setIsOpen(!isOpen);
        toast.success(message);
      }
    }
  };
  const RemovePassword = () => {
    if (socket && join) {
      socket.emit("RemovePassword", { channel_id: join.room_id });
      setIsOpen(!isOpen);
      toast.success("Password deleted successfully!");
    }
  };
  return (
    <div ref={divRef} className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={faLock} className="chat-icons" />
      </button>
      {isOpen &&
        (!status ? (
          <div className="absolute z-20 right-0 flex gap-1 bg-gray-100 p-1 pr-2 rounded-lg bg-opacity-90 shadow-md shadow-black">
            <input
              type="text"
              ref={uname}
              className="rounded-lg px-1"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  SetPassword("Password added successfully !");
                }
              }}
            />
            <button
              onClick={() => SetPassword("Password added successfully !")}
            >
              Set
            </button>
          </div>
        ) : (
          <div
            className="absolute z-20 right-0 flex gap-1 bg-gray-100 p-1 pr-2 rounded-lg bg-opacity-90 shadow-md shadow-black"
            ref={divRef}
          >
            <div className="flex gap-1">
              <input
                type="text"
                ref={uname}
                className="rounded-lg px-1"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    SetPassword("Password modified successfully !");
                  }
                }}
              />
              <button
                onClick={() => SetPassword("Password modified successfully!")}
              >
                <MdChangeCircle />
              </button>
            </div>
            <span>/</span>
            <button onClick={RemovePassword}>
              <MdRemoveModerator />
            </button>
          </div>
        ))}
    </div>
  );
};

export default RoomPassword;
