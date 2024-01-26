import PongLogo from '../components/PongLogo';
import Login from '../components/Login';
import useUser from '../hooks/useUser';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { loginSocket, logoutSocket } from '../socket';
import { useEffect } from 'react';

const LoginPage = () => {
	const { data: user, isLoading, error } = useUser();
	useEffect(() => {
		if (error || !user) {
			logoutSocket();
		}
	}, [user, error]);
	if (!error && user) return <Navigate to={'/'} />;
	if (isLoading) return <Loading />;
	return (
		<div className="h-screen">
			<PongLogo />
			<Login />
		</div>
	);
};

export default LoginPage;
