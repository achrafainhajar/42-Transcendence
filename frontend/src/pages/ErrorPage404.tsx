import { Link } from "react-router-dom";
import stupid from "../assets/GameImages/stupid.png";
//import stupid from "../assets/stupid.png";
import loser from "../assets/GameImages/loser.gif";

export default function ErrorPage404() {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-wrap">
      <div className="text-center sm:flex-none bg-[#c4e2e6] px-3 py-5 rounded-lg drop-shadow-lg">
        <h2 className="text-5xl font-semibold mb-2">404 Not Found</h2>
        <p className="text-black/40  mb-10">Sorry, we can’t find that page.</p>
        {/*<img src={stupid} alt="" /> 50% show loser and 50% show stupid*/}
        <img src={Math.random() > 0.5 ? loser : stupid} alt="404 image" />
        <Link
          to="/"
          className="max-w-[149px] py-1 px-2 inline-block hover:bg-black/5 w-full rounded-lg text-black/40  border border-black/5  bg-transparent  text-black transition-all duration-300"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
}
