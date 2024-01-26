import PongLogo from "../components/PongLogo";
import Login from "../components/Login";
import { useParams } from "react-router-dom";
import OTPInputComponent from "../components/user/OTPInputComponent";
import apiClient from "../services/api-client";
import { Navigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

const TwoFAPage = () => {
  // get params using useParams from url (twofauuid)
  const { uuid } = useParams<{ uuid: string | undefined }>();
	const { data: user, isLoading, error } = useUser();

	if (!error && user) return <Navigate to={'/'} />;
  return (
    <>
      <PongLogo />
      <Login />
      <OTPInputComponent
        postSubmit={async ({ otp }) => {
          return await apiClient.post(`/auth/2fa`, {
            uuid: uuid,
            code: otp,
          });
        }}
		generateSecret={false}
		canClose={false}
        onClose={() => {
          window.location.href = "/profile";
        }}
      />
    </>
  );
};

export default TwoFAPage;
