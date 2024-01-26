import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar/NavBar';
import SideBar from '../components/SideBar';
import useUser from '../hooks/useUser';
import Loading from '../components/Loading';
import socket, { loginSocket } from '../socket';
import toast, { Toaster } from 'react-hot-toast';
import { Notification as NotificationEvent } from '../types/notification';
import Notification from '../components/Notification';
import { useNotificationStore } from '../stores/notificationStore';
import { useEffect } from 'react';
const HomePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	useEffect(() => {
		socket?.on('GoStartYourGame', ({ invite_id, role,mode }: any) => {
			//if(document.hasFocus())
			if(invite_id && role && mode && (mode === "classic" || mode === "power"))
				navigate(`/queue/${mode}?id=${invite_id}&role=${role ?? 'classic'}`);
		});
		return () => {
			socket?.off('GoStartYourGame');
		};
	}, [location, navigate]);

	const {
		notifications,
		addNotification,
		setNotification,
		removeNotification,
	} = useNotificationStore();
	useEffect(() => {
		socket?.on('UpdateNotification', (data: NotificationEvent) => {
			if (data.is_deleted) removeNotification(data, false);
			else setNotification(data, false);
		});
		socket?.on('Notification', (data: NotificationEvent) => {
			if (
				data.type !== 'MESSAGE' &&
				data.type !== 'FRIEND_REQUEST_ACCEPTED' &&
				data.type !== 'FRIEND_REQUEST' &&
				data.type !== 'GAME_INV'
			)
				return;

			const idx1 = notifications.findIndex(
				(n) =>
					n.type === 'GAME_INV' &&
					'GAME_INV' === data.type &&
					n.invite.id === data.invite.id
			);
			if (idx1 !== -1) return;
			addNotification(data);
			//  if (document.hasFocus())
			toast.custom((t) => <Notification notification={data} t={t} />, {
				duration:
					data.type === 'MESSAGE' || data.type === 'FRIEND_REQUEST_ACCEPTED'
						? //? Infinity
						  2000
						: 3000,
			});
		});
		return () => {
			socket?.off('Notification');
			socket?.off('UpdateNotification');
		};
	}, [notifications]);

	const { data, error, isLoading } = useUser();
	const { pathname } = useLocation();
	useEffect(() => {
		loginSocket();
		return () => {};
	}, [data]);

	if (isLoading) return <Loading />;
	if (error || !data) return <Navigate to={'/login'} />; //maybe ?
	if (!data.is_profile_finished && pathname !== '/profile')
		return <Navigate to={'/profile'} />; //maybe ?
	return (
		<div className="container mx-auto h-screen">
			<Toaster position="top-right" reverseOrder={false} />
			<NavBar />
			<div className="flex justify-between gap-5 flex-col md:flex-row h-5/6 p-5">
				<SideBar />
				<Outlet />
			</div>
		</div>
	);
};

export default HomePage;
