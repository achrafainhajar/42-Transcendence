import React from "react";
import { useNotificationStore } from "../../../stores/notificationStore";
import { IMGURL } from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../../types/notification";
import NotificationItem from "./NotificationItem";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function NotificationList({ visible, onClose }: Props) {
  const { notifications, removeNotification, readNotification } =
    useNotificationStore();

  const navigate = useNavigate();
  const refirectToUser = (
    e: React.MouseEvent<HTMLDivElement | HTMLSpanElement, MouseEvent>,
    notification: Notification
  ) => {
    e.stopPropagation();
    onClose();
    navigate(`/users/${notification.User.username}`);
  };

  return (
    // i want this div to be absolute and on top of everything and right side of document not just relative parent
    //absolute  top-[40px] inset-0 max-w- w-96 p-4 text-gray-500 bg-white rounded-lg shadow
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`${
        !visible ? "hidden" : "hidden group-focus:block"
      } absolute   top-[100%]  right-0 max-h-[600px] overflow-scroll md:max-w-full  w-96 p-2 text-gray-500 bg-white rounded-lg shadow z-50`}
    >
      <div className="flex p-2 justify-center items-center mb-2">
        <div className="flex-grow text-left font-semibold text-black ">
          Notifications
        </div>
        <div
          className="mx-auto md:hidden self-end  items-center justify-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-0 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 "
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faClose} className="chat-icons " />
        </div>
      </div>
      <div className="h-[2px] bg-black/5 block my-2"></div>

      <ul className="overflow-y-scroll md:max-h-[600px]  max-h-screen md:h-fit h-full flex flex-col gap-2">
        {notifications.length === 0 && (
          <li className="w-full p-2 text-gray-500 bg-white  rounded-lg flex flex-wrap items-center pointer-events-auto ring-1 ring-black ring-opacity-5 ">
            <div className="text-center w-full">No Notifications</div>
          </li>
        )}
        {notifications.length > 0 && (
          <li className="flex justify-around">
            <div
              className="text-center hover:bg-slate-200 text-black rounded p-2 "
              onClick={() => {
                notifications.forEach((n) => {
                  readNotification(n);
                });
              }}
            >
              Mark all as read
            </div>
            <div
              className="text-center hover:bg-red-200 hover:text-gray-700 text-black rounded p-2 "
              onClick={() => {
                notifications.forEach((n) => {
                  removeNotification(n);
                });
              }}
            >
              Clear all
            </div>
          </li>
        )}
        {notifications
          .reverse()
          //  .filter(n=>n.read)
          //.slice(1, 3)
          .map((notification) => {
            return (
              <li
                key={notification.id}
                onClick={(e) => {
                  e.stopPropagation();
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
                className={`${
                  notification.read
                    ? "text-black bg-gray-100"
                    : "text-gray-500 bg-white"
                }  group w-full p-2   hover:text-black hover:bg-gray-200 rounded-lg flex flex-wrap items-center pointer-events-auto ring-1 ring-black ring-opacity-5`}
                //}  group w-full p-2  h-24  hover:text-black hover:bg-gray-200 rounded-lg flex flex-wrap items-center pointer-events-auto ring-1 ring-black ring-opacity-5`}
              >
                <img
                  onClick={(e) => {
                    refirectToUser(e, notification);
                  }}
                  className=" mx-auto object-cover w-14 h-14 rounded-lg hover:opacity-80 cursor-pointer "
                  src={IMGURL + notification.User.avatar}
                  alt="user avatar"
                />
                <div className="ms-3 text-sm text-left font-normal w-48  ">
                  <span
                    onClick={(e) => {
                      refirectToUser(e, notification);
                    }}
                    className="mb-1 text-sm font-semibold text-gray-900 cursor-pointer hover:text-black"
                  >
                    {notification.User.username}
                  </span>
                  {/*<div className="mb-1 text-sm font-normal">
                    Sent you a friend request
                  </div>
                  <div className="group-odd:hidden grid grid-cols-2 gap-2">
                    <div className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                      Accept
                    </div>
                    <div className=" cursor-pointer inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 ">
                      Reject
                    </div>
                  </div>*/}
                  {(() => {
                    switch (notification.type) {
                      case "MESSAGE": {
                        return (
                          <NotificationItem.MessageItem
                            notification={notification}
                          />
                        );
                      }
                      case "FRIEND_REQUEST_ACCEPTED": {
                        return <NotificationItem.FriendRequestAccepted />;
                      }
                      case "FRIEND_REQUEST": {
                        return (
                          <NotificationItem.FriendRequest
                            notification={notification}
                          />
                        );
                      }
                      case "GAME_INV": {
                        return (
                          <NotificationItem.GameInv
                            notification={notification}
                          />
                        );
                      }
                    }
                  })()}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification);
                  }}
                  className="mx-auto   items-center justify-center flex-shrink-0 text-red-400 hover:text-red-900 rounded-lg focus:ring-0 focus:ring-red-300 p-1.5 hover:bg-red-100 inline-flex h-8 w-8 "
                >
                  <FontAwesomeIcon icon={faTrash} className="chat-icons " />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
