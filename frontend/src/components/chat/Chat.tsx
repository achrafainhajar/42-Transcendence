import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import usePageStore from "../../stores/pageStore";
import { useEffect } from "react";

const Chat = () => {
  const setPage = usePageStore((s) => s.setPage);
  useEffect(() => setPage("/chat/rooms"), []);
  const location = useLocation();
  const path = location.pathname.substring(6, 11);
  const navigate = useNavigate();
  useEffect(() => {
    if (path === "") navigate("/chat/rooms");
  }, []);
  return (
    <div className="relative w-full h-full flex flex-col gap-5 mt-5 md:mt-0 md:ml-5 text-xs lg:text-base">
      <div className="absolute flex justify-around gap-2 w-1/3 md:w-1/4 px-2  font-medium">
        <div className="flex-1 flex justify-center border-b-2 border-slate-100 pb-3 pt-5">
          <Link
            to="/chat/direct-messages/"
            style={path === "rooms" ? {} : { color: "rgb(255,140,0)" }}
          >
            Friends
          </Link>
        </div>
        <span className="border-x border-slate-100 mt-3 mb-1"></span>
        <div className="flex-1 flex justify-center border-b-2 border-slate-100 pt-5">
          <Link
            to="/chat/rooms/"
            style={path === "rooms" ? { color: "rgb(255,140,0)" } : {}}
          >
            Rooms
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Chat;
