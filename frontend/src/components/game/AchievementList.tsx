import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IMGURL } from '../../constants';
import useAchivements from '../../hooks/useAchievements';
import Loading from '../Loading';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import useUser from '../../hooks/useUser';
import useAchievement from '../../hooks/useAchievement';
import usePageStore from '../../stores/pageStore';
import { useEffect } from 'react';

const AchievementList = () => {
	const setPage = usePageStore((s) => s.setPage);
	const {
		data: achievements,
		error: achievementsError,
		isLoading: achievementsIsLoading,
	} = useAchivements();
	useEffect(() => setPage('/achievement'), []);
	const { data: user, error: userError, isLoading: userIsLoading } = useUser();
	const { data: userAchievement, error: achievementError } = useAchievement(
		user?.id
	);
	if (achievementsIsLoading || userIsLoading) return <Loading />;
	if (
		achievementsError ||
		achievementError ||
		userError ||
		!achievements ||
		!user
	)
		return <></>;
	return (
		<div className="flex w-full h-full justify-center items-center">
			<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full md:h-[80%] md:max-h-[80%] md:overflow-y-auto">
				{achievements.map((achievement) => (
					<li
						key={achievement.id}
						className="flex w-full gap-2 items-center bg-slate-100 bg-opacity-50 rounded-[25px] px-5"
					>
						<div>
							<span
								className="font-bold text-base lg:text-xl"
								style={{ color: 'rgb(53, 15, 80' }}
							>
								{achievement.name}
							</span>
							<p className="font-medium text-sm lg:text-base">
								{achievement.description}
							</p>
							{userAchievement?.some(
								(item) => item.achievements.id === achievement.id
							) && (
								<FontAwesomeIcon icon={faTrophy} style={{ color: '#1f5125' }} />
							)}
						</div>
						<img
							className="w-14 h-14 md:h-28 md:w-28 ml-auto"
							src={IMGURL + achievement.icon_url}
							alt={achievement.name}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AchievementList;
