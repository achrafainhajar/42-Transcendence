import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import { socket_global } from "../components/game/AppGame";
import Loading from "../components/Loading";
import pongLogo from "../assets/pong-logo.webp";
import AppGame from "../components/game/AppGame";
import usePageStore from "../stores/pageStore";

const GamPage = () => {
  const setPage = usePageStore((s) => s.setPage);
  const { mode } = useParams();
  const navigate = useNavigate();
  if (mode === 'undefined' || (mode !== "classic" && mode !== "power")) navigate("/queue");
  const { data, error, isLoading } = useUser();
  if (isLoading) return <Loading />;
  if (error || !data) return <Navigate to={"/login"} />; //maybe ?
  if (!data.is_profile_finished) return <Navigate to={"/profile"} />; //maybe ?
  return (
    <div className="container mx-auto h-screen">
      <div className="flex justify-center">
        <Link
          className="md:w-[550px] w-96"
          to="/"
          onClick={() => {
            if (socket_global) socket_global.disconnect();
            setPage("/profile");
          }}
        >
          <img src={pongLogo} />
        </Link>
      </div>
      <AppGame />
    </div>
  );
};

export default GamPage;
