import { UserRelationNotification } from "../../types/notification";

import apiClient from "../../services/api-client";
import useRelations from "../../hooks/useRelations";
import { useNotificationStore } from "../../stores/notificationStore";

type Props = {
  notification: UserRelationNotification;
  onClose: () => void;
};

export const NotificationFriendRequest = ({ notification, onClose }: Props) => {
  //  const { refetch } = useRelationStatus("pending");
  const { refetch } = useRelations();
  const { setNotification } = useNotificationStore();

  return (
    <>
      <div className="mb-2 text-sm font-normal">Sent you a friend request</div>
      <div className="grid grid-cols-2 gap-2">
        <div
          onClick={async (e) => {
			e.stopPropagation();
            await apiClient.put(
              `/users/relationships/${notification.User.id}/acceptFriendRequest`
            );
            setNotification({
              ...notification,
              read: true,
              relationship: { ...notification.relationship, status: "friends" },
            });
            await refetch();
            //removeNotification(notification);
            onClose();
          }}
          className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 "
        >
          Accept
        </div>
        <div
          onClick={async (e) => {
			e.stopPropagation();
            await apiClient.delete(
              `/users/relationships/${notification.User.id}/rejectFriendRequest`
            );
            setNotification({
              ...notification,
              read: true,
              relationship: { ...notification.relationship, status: "blocked" },
            });
            await refetch();
            //removeNotification(notification);
            onClose();
          }}
          className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 "
        >
          Reject
        </div>
      </div>
    </>
  );
};
