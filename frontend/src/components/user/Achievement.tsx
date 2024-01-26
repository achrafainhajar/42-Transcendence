import { IMGURL } from '../../constants';
import useAchievement from '../../hooks/useAchievement';
import Loading from '../Loading';

interface Props {
	id: string;
}

const Achievement = ({ id }: Props) => {
	const {
		data: achievement,
		error: achievementError,
		isLoading: achievementIsLoading,
	} = useAchievement(id);

	if (achievementIsLoading) return <Loading />;
	if (achievementError || !achievement) return <></>;
	return (
		<div className="flex items-center h-full flex-col gap-4 w-full">
			<h1
				className="bg-white w-full md:w-1/2 p-2 rounded-full flex justify-center items-center shadow-lg shadow-black"
				style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
			>
				Achievements
			</h1>
			{achievement.length === 0 ? (
				<div
					className="flex w-full rounded-lg p-5 shadow-2xl shadow-black"
					style={{ backgroundColor: 'rgb(196, 226, 230, 0.3)' }}
				>
					No achivement unlocked yet
				</div>
			) : (
				<ul className="flex flex-col items-center w-full h-[80%] max-h-[80%] bg-transparent overflow-y-auto gap-4">
					{achievement.map((item) => (
						<li
							key={item.achievement_id}
							className="flex w-[90%] items-center gap-1 md:gap-3 rounded-[30px] p-2 px-3 md:px-10"
							style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
						>
							<span
								className="font-bold text-xs lg:text-xl"
								style={{ color: 'rgb(53, 15, 80' }}
							>
								{item.achievements.name}
							</span>
							<img
								className="w-10 h-10 ml-auto"
								src={IMGURL + item.achievements.icon_url}
								alt={item.achievements.name}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Achievement;
