import useUser from '../../../hooks/useUser';
import usePageStore from '../../../stores/pageStore';
import Loading from '../../Loading';
import Blocked from './Blocked';
import Friends from './Friends';
import Invitation from './Invitation';
import { useEffect, useState } from 'react';

const FriendList = () => {
	const [friendFilter, setFriendFilter] = useState('friends');
	const { data: user, error, isLoading } = useUser();
	const setPage = usePageStore((s) => s.setPage);
	useEffect(() => setPage('/friends'), []);
	if (isLoading) return <Loading />;
	if (error || !user) return <></>;
	return (
		<div className="flex flex-col items-center mt-3 md:mx-5 w-full gap-3">
			<h1
				className="bg-white w-1/2 h-14 rounded-full p-2 text-2xl flex justify-center shadow-lg shadow-black"
				style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
			>
				Friends
			</h1>
			<div className="flex gap-5 w-full">
				<button
					className="bg-white w-full h-14 rounded-full p-2 text-2xl flex justify-center shadow-lg shadow-black"
					style={
						friendFilter !== 'friends'
							? { backgroundColor: 'rgb(196, 226, 230, 0.5)' }
							: { backgroundColor: 'rgb(196, 226, 230' }
					}
					onClick={() => setFriendFilter('friends')}
				>
					List
				</button>
				<button
					className="bg-white w-full h-14 rounded-full p-2 text-2xl flex justify-center shadow-lg shadow-black"
					style={
						friendFilter !== 'pending'
							? { backgroundColor: 'rgb(196, 226, 230, 0.5)' }
							: { backgroundColor: 'rgb(196, 226, 230' }
					}
					onClick={() => setFriendFilter('pending')}
				>
					Invitation
				</button>
				<button
					className="bg-white w-full h-14 rounded-full p-2 text-2xl flex justify-center shadow-lg shadow-black"
					style={
						friendFilter !== 'blocked'
							? { backgroundColor: 'rgb(196, 226, 230, 0.5)' }
							: { backgroundColor: 'rgb(196, 226, 230' }
					}
					onClick={() => setFriendFilter('blocked')}
				>
					Blocked
				</button>
			</div>
			{friendFilter === 'pending' ? (
				<Invitation userId={user.id} />
			) : friendFilter === 'blocked' ? (
				<Blocked userId={user.id} />
			) : (
				<Friends userId={user.id} />
			)}
		</div>
	);
};

export default FriendList;
