import { CreateChannelDto } from "../channel-dto";
import { Socket } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";


export interface Props {
  rooms: CreateChannelDto[];
  socket: Socket | null;
}

const ShowRooms = ({ socket, rooms }: Props) => {
  const navigate = useNavigate();
  const { chanelId } = useParams();
  const handleJoinClick = (room_id: string) => {
    if (socket) {
      navigate(`/chat/rooms/${room_id}`);
    }
  };
  return (
    <div className="h-[90%]">
      <ul className="h-full max-h-full overflow-y-auto flex flex-col gap-2">
        {rooms.map((room) => (
          <li key={room.name}>
            <button
              className="flex items-center justify-center gap-3 w-full h-10"
              style={
                chanelId === room.id
                  ? { backgroundColor: "rgb(53, 15, 80, 0.4" }
                  : {}
              }
              onClick={() => {
                handleJoinClick(room.id);
              }}
            >
              <span
                className={
                  chanelId !== room.id ? "border-b-4 p-2 truncate" : "truncate"
                }
                style={chanelId !== room.id ? { borderColor: "#d34813" } : {}}
              >
                {room.name}
              </span>
              {chanelId === room.id && (
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

export default ShowRooms;
