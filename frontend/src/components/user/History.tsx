import { Link } from 'react-router-dom';
import { IMGURL } from '../../constants';
import useHistory from '../../hooks/useHistory';
import useUser from '../../hooks/useUser';
import Loading from '../Loading';
import { useEffect } from 'react';

const History = () => {
	const { data: user, error: userError, isLoading: userIsLoading } = useUser();
	const {
		data: history,
		error: historyError,
		isLoading: historyIsLoading,
		refetch: refetchHistory,
	} = useHistory(user?.id);
	useEffect(() => {
		if (user?.is_profile_finished) refetchHistory();
	}, [user, refetchHistory]);
	if (!user?.is_profile_finished) return <></>;
	if (userIsLoading) return <Loading />;
	if (userError || !user) return <></>;
	if (historyIsLoading) return <Loading />;
	if (historyError || !history) return <></>;

	return (
		<div className="flex items-center flex-col gap-4 w-full">
			<h1
				className="bg-white w-full md:w-1/2 p-2 rounded-full flex justify-center items-center shadow-lg shadow-black"
				style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
			>
				History
			</h1>
			{history.length === 0 ? (
				<div
					className="flex w-full rounded-lg p-5 shadow-2xl shadow-black"
					style={{ backgroundColor: 'rgb(196, 226, 230, 0.3)' }}
				>
					No match found
				</div>
			) : (
				<ul className="flex flex-col w-full items-center h-[80%] max-h-[80%] bg-transparent overflow-y-auto gap-4">
					{history.map((item) => {
						const winner = item.winner_id === user.id;
						const userIsOne = item.Player1.id === user.id;
						const userOne = userIsOne ? item.Player1 : item.Player2;
						const player = !userIsOne ? item.Player1 : item.Player2;
						const userScore = userIsOne ? item.score1 : item.score2;
						const playerScore = !userIsOne ? item.score1 : item.score2;
						return (
							<li
								key={item.id}
								className="flex w-[90%]  gap-1 items-center justify-around font-medium lg:text-xl rounded-[30px] p-2 px-3"
								style={{
									backgroundColor: winner
										? 'rgb(10, 193, 38, 0.3)'
										: 'rgb(139, 10, 10, 0.3)',
								}}
							>
								<Link to={`/users/${userOne.username}`}>
									<img
										className="w-10 h-10 rounded-full"
										src={IMGURL + userOne.avatar}
										alt="player-1"
									/>
								</Link>
								<div className="flex gap-1 md:gap-4 border-x-2 px-1 md:px-3">
									<span
										style={{
											color: winner ? '#54EB6C' : '#F10B0B',
										}}
									>
										{userScore}
									</span>
									<span className="text-white">{' - '}</span>
									<span
										style={{
											color: !winner ? '#54EB6C' : '#F10B0B',
										}}
									>
										{playerScore}
									</span>
								</div>
								<Link to={`/users/${player.username}`}>
									<img
										className="w-10 h-10 rounded-full"
										src={IMGURL + player.avatar}
										alt="player-2"
									/>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default History;
