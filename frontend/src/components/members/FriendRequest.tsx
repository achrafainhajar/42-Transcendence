import { useCallback } from "react";
import apiClient from "../../services/api-client";
import { refetchRelation } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faUserClock,
  faUserXmark,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { IoMdCloseCircle } from "react-icons/io";

interface Props {
  whoSent: string;
  playerId: string;
  refetch: refetchRelation;
}
const FriendRequest = ({ whoSent, playerId, refetch }: Props) => {
  const sendFriendRequest = useCallback(
    async (request: string, message: string) => {
      try {
        if (request === "acceptFriendRequest") {
          await apiClient.put(
            `/users/relationships/${playerId}/acceptFriendRequest`
          );
        } else {
          await apiClient.delete(`/users/relationships/${playerId}/${request}`);
        }
        toast((t) => (
          <div className="flex justify-center gap-1 items-center">
            <span>{message}</span>
            <button
              className="w-auto text-blue-900 hover:text-blue-800"
              onClick={() => toast.dismiss(t.id)}
            >
              <IoMdCloseCircle />
            </button>
          </div>
        ));
        await refetch();
      } catch (error) {}
    },
    []
  );
  return (
    <div className="flex gap-7 items-center">
      {whoSent !== "me" ? (
        <FontAwesomeIcon icon={faUserClock} className="react-icons" />
      ) : (
        <button
          onClick={() => {
            sendFriendRequest(
              "acceptFriendRequest",
              "Player added successfully !"
            );
          }}
        >
          <FontAwesomeIcon icon={faUserCheck} className="react-icons" />
        </button>
      )}
      <button
        onClick={() => {
          sendFriendRequest(
            whoSent === "me" ? "rejectFriendRequest" : "cancelFriendRequest",
            whoSent === "me"
              ? "Friend request rejected successfully !"
              : "Friend request canceled successfully !"
          );
        }}
      >
        <FontAwesomeIcon icon={faUserXmark} className="react-icons" />
      </button>
    </div>
  );
};

export default FriendRequest;
