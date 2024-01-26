import { GameInvNotification } from "../../types/notification";
import gsocket from "../../socket";
import { useNotificationStore } from "../../stores/notificationStore";
type Props = {
  notification: GameInvNotification;
  onClose: () => void;
};

export const NotificationGameInv = ({ notification, onClose }: Props) => {
  const { setNotification } = useNotificationStore();
  return (
    <>
      <div className="mb-2 text-sm font-normal">Sent you a Game Invitation</div>
      <div className="grid grid-cols-2 gap-2">
        <div
          onClick={async (e) => {
			e.stopPropagation();
            setNotification({
              ...notification,
              read: true,
              invite: { ...notification.invite, status: "accepted" },
            });          
             onClose();
            gsocket?.emit("AcceptInvite", { id: notification.invite.id });

            //await refetch();
           
          }}
          className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 "
        >
          Accept
        </div>
        <div
          onClick={async (e) => {
			e.stopPropagation();
            setNotification({
              ...notification,
              read: true,
              invite: { ...notification.invite, status: "rejected" },
            });
             onClose();
           gsocket?.emit("RejectReq", { id: notification.invite.id });
            //await refetch();
          }}
          className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 "
        >
          Reject
        </div>
      </div>
    </>
  );
};
