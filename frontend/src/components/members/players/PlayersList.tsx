import { Link } from 'react-router-dom';
import usePlayers from '../../../hooks/usePlayers';
import { IMGURL } from '../../../constants';
import Loading from '../../Loading';
import usePageStore from '../../../stores/pageStore';
import { useEffect } from 'react';

const PlayersList = () => {
	const { data: players, error, isLoading } = usePlayers();
	const setPage = usePageStore((s) => s.setPage);
	useEffect(() => setPage('/users'), []);
	if (isLoading) return <Loading />;
	if (error || !players) return <></>;
	return (
		<div className="flex flex-col gap-5 mt-3 md:mx-5 w-full">
			{players.map((player) => (
				<div
					className="flex p-2 w-full rounded-lg shadow-lg shadow-black pl-3"
					style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
					key={player.id}
				>
					<Link to={`/users/${player.username}`} className="flex max-w-xs">
						<img
							src={IMGURL + player.avatar}
							className="h-14 w-14 rounded-full shadow-lg shadow-black"
						/>
						<p className="m-3 block truncate flex-grow">{player.username}</p>
					</Link>
				</div>
			))}
		</div>
	);
};

export default PlayersList;
