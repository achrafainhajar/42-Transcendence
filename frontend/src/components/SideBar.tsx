import { Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import usePageStore from '../stores/pageStore';
import { IMGURL } from '../constants';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCircleUser,
	faComments,
	faUsers,
	faTrophy,
	faTableTennisPaddleBall,
	faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
const sideElement = [
	{ label: '/profile', icon: faCircleUser, tag: 'Profile' },
	{ label: '/queue', icon: faTableTennisPaddleBall, tag: 'Queue' },
	{ label: '/chat/rooms', icon: faComments, tag: 'Rooms' },
	{ label: '/users', icon: faUsers, tag: 'Players' },
	{ label: '/friends', icon: faUserGroup, tag: 'Friends' },
	{ label: '/achievement', icon: faTrophy, tag: 'Achievement' },
];

const SideBar = () => {
	const { data: user, error, isLoading } = useUser();
	const page = usePageStore((s) => s.page);
	if (isLoading) return <Loading />;
	if (error || !user) return <></>;
	return (
		<aside
			className="order-1 md:order-none min-w-fit mb-4 md:mb-0 rounded-[60px] shadow-lg shadow-black"
			style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
		>
			<div className="hidden md:block">
				<div className="flex p-5 gap-5 items-center">
					<Link to="/profile">
						<img
							src={IMGURL + user.avatar}
							className="h-14 w-14 rounded-full shadow-lg shadow-black"
						/>
					</Link>
					<Link className="max-w-[100px]" to="/profile">
						<div className="block truncate flex-grow">{user.username}</div>
					</Link>
				</div>
			</div>
			<ul className="flex md:flex-col justify-around md:gap-5 items-center px-2 md:px-0 py-2 md:py-5 text-sm">
				{sideElement.map((element) => (
					<li
						className="w-full px-3 py-3 md:py-0 hover:bg-opacity-80 rounded-full md:rounded-none"
						key={element.label}
						style={
							page === element.label
								? { backgroundColor: '#5279A1', fontWeight: 'bold' }
								: {}
						}
					>
						<Link
							to={element.label}
							className="flex gap-2 md:px-5 md:py-1 items-center justify-center md:justify-start"
						>
							<FontAwesomeIcon icon={element.icon} className="side-icons" />
							<span className="hidden md:inline">{element.tag}</span>
						</Link>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default SideBar;
