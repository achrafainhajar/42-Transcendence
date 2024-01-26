import { useNotificationStore } from "../../../stores/notificationStore";
import {
  GameInvNotification,
  MessageNotification,
  UserRelationNotification,
} from "../../../types/notification";
import useRelations from "../../../hooks/useRelations";
import apiClient from "../../../services/api-client";
import gsocket from "../../../socket";

function NotificationItem() {
  return (
    <div className="w-full p-4  text-gray-500 bg-white rounded-lg shadow ">
      NotificationItem
    </div>
  );
}

export function FriendRequestItem({
  notification,
}: {
  notification: UserRelationNotification;
}) {
  const { removeNotification } = useNotificationStore();
  const { refetch, data: relations } = useRelations();
  const relation = relations?.find(
    (e) => e.id === notification.relationship.id
  );
  return relation?.status === "friends" || relation?.status === "blocked" ? (
    <div className="mb-1 text-sm font-normal">
      you {relation?.status === "friends" ? "accepted" : "rejected"} this friend
      request
    </div>
  ) : (
    <>
      <div className="mb-1 text-sm font-normal">Sent you a friend request</div>
      <div className="group-odd:hidden grid grid-cols-2 gap-2">
        <div
          onClick={async () => {
            await apiClient.put(
              `/users/relationships/${notification.User.id}/acceptFriendRequest`
            );
            await refetch();
            removeNotification(notification);
            //onClose();
          }}
          className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 "
        >
          Accept
        </div>
        <div
          onClick={async () => {
            await apiClient.delete(
              `/users/relationships/${notification.User.id}/rejectFriendRequest`
            );
            await refetch();
            removeNotification(notification);
            //onClose();
          }}
          className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 "
        >
          Reject
        </div>
      </div>
    </>
  );
}

export function GameInv({
  notification,
}: {
  notification: GameInvNotification;
}) {
  const { removeNotification } = useNotificationStore();

  return notification.invite.status !== "pending" ? (
    <div className="mb-1 text-sm font-normal">
      you {notification.invite.status} this game invite
    </div>
  ) : (
    <>
      <div className="mb-1 text-sm font-normal">
        Sent you a invitaion to a game
      </div>
      <div className="group-odd:hidden grid grid-cols-2 gap-2">
        <div
          onClick={async () => {
            removeNotification(notification);
            gsocket?.emit("AcceptInvite", { id: notification.invite.id });
            //onClose();
          }}
          className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 "
        >
          Accept
        </div>
        <div
          onClick={async () => {
            removeNotification(notification);
            gsocket?.emit("RejectReq", { id: notification.invite.id });
            //onClose();
          }}
          className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 "
        >
          Reject
        </div>
      </div>
    </>
  );
}

export function MessageItem({
  notification,
}: {
  notification: MessageNotification;
}) {
  return (
    <div className="mb-1 text-sm font-normal">
      {notification.message.content}
    </div>
  );
}
export function FriendRequestAccepted() {
  return (
    <div className="mb-1 text-sm font-normal">accepted your friend request</div>
  );
}

NotificationItem.FriendRequest = FriendRequestItem;
NotificationItem.MessageItem = MessageItem;
NotificationItem.FriendRequestAccepted = FriendRequestAccepted;
NotificationItem.GameInv = GameInv;
export default NotificationItem;
