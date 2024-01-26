import useRelations from "../../../hooks/useRelations";
import RelationCard from "./RelationCard";
import Relation from "../../../entities/Relation";
import Loading from "../../Loading";

const checkRelationStatus = (
  userId: string,
  playerId: string,
  relations: Relation[],
  status: string
) => {
  const playerRelation = relations.filter(
    (r) => (r.User1.id === playerId && r.User2.id === userId) ||
            (r.User1.id === userId && r.User2.id === playerId)
  );
  if (
    playerRelation.length !== 0 &&
    playerRelation[0].status === status
  ) {
    if (
      playerRelation[0].User2.id === userId)
      return "me";
    return status;
  }
  return "";
};

interface Props {
  userId: string;
  playerId: string;
}

const Relationships = ({ userId, playerId }: Props) => {
  const { data: relations, error, isLoading } = useRelations();
  if (isLoading) return <Loading />;
  if (error || !relations) return <></>;
  const blocked = checkRelationStatus(userId, playerId, relations, "blocked");
  if (blocked === "me") return <div>unavailable</div>;
  const isBlocked = blocked === "blocked";
  const whoSent = checkRelationStatus(userId, playerId, relations, "pending");
  const isFriend = checkRelationStatus(userId, playerId, relations, "friends");
  return (
    <RelationCard
      playerId={playerId}
      isBlocked={isBlocked}
      whoSent={whoSent}
      isFriend={isFriend}
    />
  );
};

export default Relationships;
