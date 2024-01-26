import { Socket } from "socket.io-client";
import { channel } from "../Channels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

interface Props {
  socket: Socket | null;
  channel: channel | null;
  closeShowMember: (show: boolean) => void;
}
const RemoveChannel = ({ socket, channel, closeShowMember }: Props) => {
  const handleRemove = () => {
    if (socket && channel) {
      socket.emit("removeChannel", { channel_id: channel.room_id });
      closeShowMember(false);
      toast.success('Room deleted succesfully!');
    }
  };

  return (
    <div>
      <button onClick={() => handleRemove()}>
        <FontAwesomeIcon icon={faTrash} className="chat-icons"/>
      </button>
    </div>
  );
};

export default RemoveChannel;
