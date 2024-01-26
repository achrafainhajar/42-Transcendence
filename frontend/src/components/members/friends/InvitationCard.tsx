import { Link } from "react-router-dom";
import Relation from "../../../entities/Relation";
import FriendRequest from "../FriendRequest";
import { IMGURL } from "../../../constants";
import useRelationStatus from "../../../hooks/useRelationStatus";

interface Props {
  relation: Relation;
  isSent: boolean;
}
const InvitationCard = ({ relation, isSent }: Props) => {
  const { refetch } = useRelationStatus("pending");
  const user = isSent ? relation.User2 : relation.User1;
  return (
    <div
      className="flex p-2 w-full rounded-lg shadow-lg shadow-black pl-3 justify-between"
      style={{ backgroundColor: "rgb(196, 226, 230, 0.5)" }}
      key={relation.id}
    >
      <Link to={`/users/${user.username}`} className="flex max-w-xs">
        <img
          src={IMGURL + user.avatar}
          className="h-14 w-14 rounded-full shadow-lg shadow-black"
        />
        <span className="m-3 block truncate flex-grow">{user.username}</span>
      </Link>
      {isSent ? (
        <span className="m-3">Pending...</span>
      ) : (
        <FriendRequest
          whoSent={isSent ? "pending" : "me"}
          playerId={user.id}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default InvitationCard;
