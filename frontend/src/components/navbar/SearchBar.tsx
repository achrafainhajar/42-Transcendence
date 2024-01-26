import { useEffect, useRef, useState } from 'react';
import usePlayers from '../../hooks/usePlayers';
import { Link } from 'react-router-dom';
import { IMGURL } from '../../constants';
import Loading from '../Loading';
import useUser from '../../hooks/useUser';

const SearchBar = () => {
	const ref = useRef<HTMLFormElement>(null);
	const {
		data: players,
		error,
		isLoading,
		refetch: refetchPlayers,
	} = usePlayers();
	const [searchQuery, setSearchQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const { data: user } = useUser();
	useEffect(() => {
		if (user?.is_profile_finished) refetchPlayers();
	}, [user, refetchPlayers]);
	const handleMouseClick = (event: MouseEvent) => {
		if (ref && ref.current && !ref.current.contains(event.target as Node))
			setIsOpen(false);
	};
	useEffect(() => {
		document.addEventListener('mousedown', handleMouseClick);

		return () => {
			document.removeEventListener('mousedown', handleMouseClick);
		};
	}, []);
	if (isLoading) return <Loading />;
	let filterdPlayers: any = [];
	if ((error || !players) && user?.is_profile_finished === true) return <></>;
	if (!players) filterdPlayers = [];
	else
		filterdPlayers =
			searchQuery === ''
				? players
				: players.filter((player) => {
						return player.username
							.toLowerCase()
							.includes(searchQuery.toLowerCase());
				  });
	return (
		<form
			ref={ref}
			onSubmit={(event) => {
				event.preventDefault();
			}}
			className="h-full overflow-visible relative mr-1"
		>
			<input
				placeholder="Search..."
				className="w-full h-full rounded-full border-2 p-2"
				style={{ borderColor: '#BACCEF' }}
				onChange={(event) => {
					setSearchQuery(event.target.value);
					event.target.value !== '' ? setIsOpen(true) : setIsOpen(false);
				}}
			/>
			{isOpen && (
				<ul
					className="rounded-lg z-50 flex flex-col absolute top-[42px] w-full shadow-black"
					style={{ backgroundColor: 'rgb(196, 226, 230' }}
				>
					{filterdPlayers.map((p: any) => (
						<li
							className="flex items-center w-full rounded-lg border-2"
							key={p.id}
						>
							<Link to={`/users/${p.username}`} className="flex p-2 gap-5">
								<img
									src={IMGURL + p.avatar}
									className="h-8 w-8 rounded-full shadow-lg shadow-black"
								/>
								<div className="flex items-center">
									<span className="block truncate flex-grow max-w-[150px] md:max-w-[200px]">
										{p.username}
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</form>
	);
};

export default SearchBar;
