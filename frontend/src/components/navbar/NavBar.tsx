import pongLogo from '../../assets/pong-logo.webp';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import usePageStore from '../../stores/pageStore';
import { useCallback, useState } from 'react';
import apiClient from '../../services/api-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faComments,
	faRightFromBracket,
	faBell,
} from '@fortawesome/free-solid-svg-icons';
import { useNotificationStore } from '../../stores/notificationStore';
import NotificationList from '../Notification/NotificationList';
import { useQueryClient } from '@tanstack/react-query';
import { logoutSocket } from '../../socket';

const NavBar = () => {
	const setPage = usePageStore((s) => s.setPage);
	const { notifications } = useNotificationStore();
	const [showNotifications, setshowNotifications] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const logOutClient = useCallback(async () => {
		await apiClient.get('/auth/signout');
		queryClient.removeQueries({ queryKey: ['user'] });
		logoutSocket();
		navigate('/login');
	}, []);
	return (
		<div className="flex flex-col md:flex-row border-b max-h-full min-h-[100px] h-max">
			<div className="w-full flex justify-center md:w-1/5 md:max-w-xs">
				<Link
					className="flex justify-center items-center"
					to="/"
					onClick={() => {
						setPage('/profile');
					}}
				>
					<img src={pongLogo} className="w-96" />
				</Link>
			</div>
			<div className="relative flex w-full md:w-4/5 flex-wrap justify-center items-center">
				<div className="flex-grow h-10 ml-4 min-w-[250px] mb-2">
					<SearchBar />
				</div>
				<div className="flex justify-around gap-2 items-center w-fit mr-4 mb-2 h-fit">
					<Link
						to="/chat/direct-messages"
						className="flex h-10 min-w-[2.5rem] p-1 px-2 gap-2 items-center justify-center rounded-lg shadow-md shadow-black"
						style={{ backgroundColor: 'rgb(196, 226, 230' }}
					>
						<FontAwesomeIcon icon={faComments} className="chat-icons" />
					</Link>

					<button
						onClick={(e) => {
							e.stopPropagation();
							setshowNotifications(!showNotifications);
						}}
						className="group flex h-10 min-w-[2.5rem] p-1 px-2 gap-2 items-center justify-center rounded-lg shadow-md shadow-black"
						style={{ backgroundColor: 'rgb(196, 226, 230' }}
					>
						<FontAwesomeIcon icon={faBell} className="chat-icons " />
						{notifications.filter((e) => !e.read).length ? (
							<div className="relative w-0 h-full">
								<span className="absolute right-0 top-0 flex h-4 w-4">
									<span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75 "></span>
									<span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[0.7rem] justify-center items-center text-white">
										{notifications.filter((e) => !e.read).length < 100
											? notifications.filter((e) => !e.read).length
											: '99+'}
									</span>
								</span>
							</div>
						) : (
							''
						)}
						<NotificationList
							visible={showNotifications}
							onClose={() => setshowNotifications(false)}
						/>
					</button>

					<button
						className="flex h-10 min-w-[2.5rem] p-1 gap-2 items-center justify-center rounded-lg shadow-md shadow-black"
						style={{ backgroundColor: 'rgb(196, 226, 230' }}
						onClick={logOutClient}
					>
						<FontAwesomeIcon icon={faRightFromBracket} className="chat-icons" />
						<span className="hidden md:inline">Logout</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
