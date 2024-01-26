import { MessageNotification } from "../../types/notification";

type Props = {
  notification: MessageNotification;
};

export const NotificationMessage = ({ notification }: Props) => {
  return (
    <div className="mb-2 text-sm font-normal truncate ">
      {notification.message.content}
    </div>
  );
};
