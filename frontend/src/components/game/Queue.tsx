import { useEffect, useState } from "react";
import ClassicMode from "../../assets/mode_classic.png";
import PowerMode from "../../assets/mode_power.png";
import { Link } from "react-router-dom";
import usePageStore from "../../stores/pageStore";

const Queue = () => {
  const [mode, setMode] = useState("classic");
  const setPage = usePageStore((s) => s.setPage);
  useEffect(() => setPage("/queue"), []);
  return (
    <div className="flex w-full flex-col pt-10 md:pt-20 items-center gap-10 md:gap-20">
      <div className="flex w-full flex-col md:flex-row justify-center gap-10 md:gap-20 text-5xl">
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="classic">
            <img className="md:w-60 md:h-60 h-40 w-40" src={ClassicMode} alt="classic" />
          </label>
          <label htmlFor="classic" className="text-center text-3xl">
            Classic Mode
          </label>
          <input
            type="radio"
            id="classic"
            name="game-mode"
            defaultChecked
            onChange={() => setMode("classic")}
          />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="power">
            <img className="md:w-60 md:h-60 h-40 w-40" src={PowerMode} alt="power" />
          </label>
          <label htmlFor="power" className="text-center text-3xl">
            Power Mode
          </label>
          <input
            type="radio"
            id="power"
            name="game-mode"
            onChange={() => setMode("power")}
          />
        </div>
      </div>
      <Link
        className="text-2xl lg:text-3xl rounded-full px-10 py-5 shadow-lg shadow-black"
        style={{ backgroundColor: "rgb(196, 226, 230, 0.5)" }}
        to={`/queue/${mode}`}
      >
        Join queue
      </Link>
    </div>
  );
};

export default Queue;
