import React, { useState } from "react";
import { Notification as NotificationProps } from "../../types/notification";
import { NotificationFriendRequest } from "./NotificationFriendRequest";
import { NotificationFriendRequestAccepted } from "./NotificationFriendRequestAccepted";
import { NotificationGameInv } from "./NotificationGameInv";
import { NotificationMessage } from "./NotificationMessage";
import toast, { Toast } from "react-hot-toast";
import { IMGURL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../stores/notificationStore";

type Props = {
  notification: NotificationProps;
  t: Toast;
};

const Notification = ({ t, notification }: Props) => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const { readNotification } = useNotificationStore();
  const onClose = () => {
    setShow(false);
    toast.dismiss(t.id);
  };
  const refirectToUser = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onClose();
    navigate(`/users/${notification.User.username}`);
  };
  return (
    <div
      onClick={() => {
        readNotification(notification);
        if (notification.type !== "GAME_INV") onClose();
        switch (notification.type) {
          case "MESSAGE": {
            navigate(`/chat/direct-messages/${notification.User.id}`);
            break;
          }
          case "FRIEND_REQUEST_ACCEPTED": {
            navigate(`/users/${notification.User.username}`);
            break;
          }
          case "FRIEND_REQUEST": {
            navigate(`/users/${notification.User.username}`, {});
            break;
          }
          case "GAME_INV": {
            //navigate(`/users/${notification.User.username}`, {});
            break;
          }
        }
      }}
      className={`
	  ${show ? "flex " : "hidden "}
	  ${
      t.visible ? "animate-enter" : " animate-leave"
    } max-w-xs min-w-xs bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div
        className="w-full p-4 text-gray-500 bg-white rounded-lg shadow "
        role="alert"
      >
        <div className="flex ">
          <img
            onClick={refirectToUser}
            className=" object-cover w-14 h-14 rounded-lg hover:opacity-80 cursor-pointer"
            src={IMGURL + notification.User.avatar}
            alt="user avatar"
          />
          <div className="ms-3 text-sm font-normal w-48  ">
            <span
              onClick={refirectToUser}
              className="mb-1 text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-950"
            >
              {notification.User.username}
            </span>
            {(() => {
              switch (notification.type) {
                case "MESSAGE": {
                  return <NotificationMessage notification={notification} />;
                }
                case "FRIEND_REQUEST_ACCEPTED": {
                  return <NotificationFriendRequestAccepted />;
                }
                case "FRIEND_REQUEST": {
                  return (
                    <NotificationFriendRequest
                      onClose={onClose}
                      notification={notification}
                    />
                  );
                }
                case "GAME_INV": {
                  return (
                    <NotificationGameInv
                      onClose={onClose}
                      notification={notification}
                    />
                  );
                }
              }
            })()}
          </div>
          <button
            type="button"
            className="ms-auto  bg-white items-center justify-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-0 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 "
            aria-label="Close"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default Notification;

/*
const Notification = ({ t, notification }: Props) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              className="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
              alt=""
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Emilia Gates {notification.type}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Sure! 8:30pm works great!
              {notification.User.username}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

*/
