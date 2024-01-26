import loginLogo from "../assets/login-logo.png";
import { API_URL } from "../constants";

const Login = () => {
  return (
    <div className="flex justify-center p-0 h-[80%] md:h-[50%]">
      <button
        className="relative"
        onClick={() => window.location.assign(API_URL + "/auth/signin")}
      >
        <img className="w-80" src={loginLogo} />
      </button>
    </div>
  );
};

export default Login;
