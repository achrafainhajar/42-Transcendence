import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Gamepage from "./pages/GamPage.tsx";
import LoginPage from "./pages/LoginPage";
import Profile from "./components/user/Profile";
import PlayersList from "./components/members/players/PlayersList";
import FriendList from "./components/members/friends/FriendList";
import Queue from "./components/game/Queue";
import PlayerCard from "./components/members/players/PlayerCard";
import AchievementList from "./components/game/AchievementList.tsx";
import Channels from "./components/chat/Channels.tsx";
import DirectMessages from "./components/chat/DirectMessages.tsx";
import Chat from "./components/chat/Chat.tsx";
import TwoFAPage from "./pages/TwoFAPage.tsx";
import ErrorPage404 from "./pages/ErrorPage404.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage404 />,
    children: [
      { path: "profile?", element: <Profile /> },
      { path: "queue", element: <Queue /> },
      { path: "users", element: <PlayersList /> },
      { path: "friends", element: <FriendList /> },
      { path: "achievement", element: <AchievementList /> },
      { path: "users/:username", element: <PlayerCard /> },

      {
        path: "chat/",
        element: <Chat />,
        children: [
          { path: "rooms/:chanelId?", element: <Channels /> },
          { path: "direct-messages/:dmId?", element: <DirectMessages /> },
        ],
      },
    ],
  },
  { path: "/queue/:mode", element: <Gamepage /> },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/2fa/:uuid",
    element: <TwoFAPage />,
  },
]);

export default router;
