import { useParams } from 'react-router-dom';
import usePlayer from '../../../hooks/usePlayer';
import useUser from '../../../hooks/useUser';
import Relationships from './Relationships';
import usePageStore from '../../../stores/pageStore';
import { IMGURL } from '../../../constants';
import Loading from '../../Loading';
import { useEffect } from 'react';
import Achievement from '../../user/Achievement';
import useRelationStatus from '../../../hooks/useRelationStatus';

const PlayerCard = () => {
	const setPage = usePageStore((s) => s.setPage);
	useEffect(() => {
		setPage('');
	}, []);
	const { username } = useParams();
	const {
		data: player,
		error,
		isLoading: playerIsLoading,
	} = usePlayer(username!);
	const { data: user } = useUser();
	const { data: friends, isLoading: friendIsLoading } =
		useRelationStatus('friends');
	const { data: blocks, isLoading: blocksIsLoading } =
		useRelationStatus('blocked');
	if (playerIsLoading || friendIsLoading || blocksIsLoading) return <Loading />;
	if (error || !player || !user || !friends) return <></>;
	const isBlocked = blocks?.filter(
		(block) => (block.User1.id === player.id || block.User2.id === player.id) && player.id != user.id
	);
	const isFriend =
		friends.filter(
			(friend) => friend.User1.id === player.id || friend.User2.id === player.id
		).length !== 0;
	return (
		<div className="flex justify-center w-full h-full">
			<div className="flex gap-5 p-5 items-center flex-col w-[80%] md:w-1/2 rounded-xl bg-slate-100 bg-opacity-50">
				<img
					src={IMGURL + player.avatar}
					className="h-16 w-16 rounded-full shadow-lg shadow-black border-2"
					style={{
						borderColor: isFriend
							? !player.is_online
								? '#778899'
								: player.is_in_game
								? '#FF8C00'
								: '#3CB371'
							: '',
					}}
				/>
				<div className="flex flex-col w-full items-center gap-1 text-base	lg:text-xl">
					<span
						className="block truncate flex-grow h-12 font-medium max-w-[150px] md:max-w-[200px]"
						style={{ color: 'rgb(53, 15, 80' }}
					>
						{player.username}
					</span>
					{isFriend && (
						<span
							style={{
								color: !player.is_online
									? '#4E4E4E'
									: player.is_in_game
									? '#FF770B'
									: '#54EB6C',
							}}
						>
							{!player.is_online
								? 'offline'
								: player.is_in_game
								? 'in game'
								: 'online'}
						</span>
					)}
					{user.id !== player.id && (
						<Relationships userId={user.id} playerId={player.id} />
					)}
					{isBlocked?.length === 0 ? (
						<Achievement id={player.id} />
					) : (
						isBlocked?.pop()?.User2.id === player.id && (
							<div
								className="p-5 rounded-lg shadow-sm shadow-black text-base md:text-xl"
								style={{ backgroundColor: 'rgb(196, 226, 230, 0.3)' }}
							>
								The Player is blocked, unblock if you want to see player
								informations.
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default PlayerCard;
