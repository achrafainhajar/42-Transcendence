import { useCallback } from "react";
import apiClient from "../../../services/api-client";
import { ImBlocked } from "react-icons/im";
import { CgUnblock } from "react-icons/cg";
import FriendRequest from "../FriendRequest";
import { useNavigate } from "react-router-dom";
import useRelations from "../../../hooks/useRelations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { IoMdCloseCircle } from "react-icons/io";

interface Props {
  playerId: string;
  isBlocked: boolean;
  whoSent: string;
  isFriend: string;
}

const RelationCard = ({ playerId, isBlocked, whoSent, isFriend }: Props) => {
  const navigate = useNavigate();
  const { refetch } = useRelations();
  const sendRelationRequest = useCallback(
    async (relation: string, message: string) => {
      try {
        if (relation === "sendFriendRequest") {
          await apiClient.post(
            `/users/relationships/${playerId}/sendFriendRequest`
          );
        } else if (relation === "blockUser") {
          await apiClient.put(`/users/relationships/${playerId}/blockUser`);
        } else if (relation === "unblockUser") {
          await apiClient.delete(
            `/users/relationships/${playerId}/unblockUser`
          );
        } else if (relation === "unfriendUser") {
          await apiClient.delete(
            `/users/relationships/${playerId}/unfriendUser`
          );
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
    <div className="flex gap-7 m-5">
      {!isBlocked &&
        (isFriend === "" ? (
          whoSent !== "" ? (
            <FriendRequest
              whoSent={whoSent}
              playerId={playerId}
              refetch={refetch}
            />
          ) : (
            <button
              onClick={() => {
                sendRelationRequest(
                  "sendFriendRequest",
                  "Friend request sent successfully !"
                );
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} className="react-icons" />
            </button>
          )
        ) : (
          <button
            onClick={() => {
              sendRelationRequest(
                "unfriendUser",
                "Player removed successfully !"
              );
            }}
          >
            <FontAwesomeIcon icon={faUserMinus} className="react-icons" />
          </button>
        ))
        }
      {!isBlocked && (
        <button onClick={() => navigate(`/chat/direct-messages/${playerId}`)}>
          <FontAwesomeIcon icon={faMessage} className="react-icons" />
        </button>
      )}
      {isBlocked ? (
        <button
          onClick={() => {
            sendRelationRequest(
              "unblockUser",
              "Player unblocked successfully !"
            );
          }}
        >
          <CgUnblock />
        </button>
      ) : (
        <button
          onClick={() => {
            sendRelationRequest("blockUser", "Player blocked successfully !");
          }}
        >
          <ImBlocked />
        </button>
      )}
    </div>
  );
};

export default RelationCard;
