import LoadingBall from "../assets/Loading-ball.png";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <img src={LoadingBall} className="w-[80%] h-[80%]" />
    </div>
  );
};

export default Loading;
