import {  CreateChannelDto } from "../channel-dto";
import { Socket } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

export interface Props {
  rooms: CreateChannelDto[];
  socket: Socket | null;
}

const ShowDms = ({ socket, rooms }: Props) => {
  const navigate = useNavigate();
  const { dmId } = useParams();
  const handleJoinClick = (room_id: string, target_id: string | undefined) => {
    if (socket && target_id && room_id) {
      navigate(`/chat/direct-messages/${target_id}`);
    }
  };
  return (
    <div className="h-full">
      <ul className="h-full max-h-full overflow-y-auto flex flex-col gap-2">
        {rooms.map((room) => (
          <li key={room.name}>
            <button
              className="flex items-center justify-center gap-3 w-full h-10"
              style={
                dmId === room.target_id
                  ? { backgroundColor: "rgb(55, 48, 163, 0.5)" }
                  : {}
              }
              onClick={() => {
                handleJoinClick(room.id, room.target_id);
              }}
            >
              <span>{room.name}</span>
              {dmId === room.target_id && (
                <FontAwesomeIcon
                  className="chat-icons"
                  icon={faAngleRight}
                  style={{ color: "#D34813" }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowDms;
