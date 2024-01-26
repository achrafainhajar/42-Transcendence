import { Link } from 'react-router-dom';
import useRelationStatus from '../../../hooks/useRelationStatus';
import { useCallback } from 'react';
import apiClient from '../../../services/api-client';
import { CgUnblock } from 'react-icons/cg';
import { IMGURL } from '../../../constants';
import Loading from '../../Loading';
import EmptyList from './EmptyList';
import toast from 'react-hot-toast';
import { IoMdCloseCircle } from 'react-icons/io';

interface Props {
	userId: string;
}

const Blocked = ({ userId }: Props) => {
	const {
		data: relations,
		error,
		isLoading,
		refetch,
	} = useRelationStatus('blocked');
	const unblockUser = useCallback(async (playerId: string) => {
		try {
			await apiClient.delete(`/users/relationships/${playerId}/unblockUser`);
			toast((t) => (
				<div className="flex justify-center gap-1 items-center">
					<span>Player unblocked successfully !</span>
					<button
						className="w-auto text-blue-900 hover:text-blue-800"
						onClick={() => toast.dismiss(t.id)}
					>
						<IoMdCloseCircle />
					</button>
				</div>
			));
			await refetch();
		} catch (error) {}
	}, []);
	if (isLoading) return <Loading />;
	if (error || !relations) return <></>;
	const userRelation = relations.filter((r) => r.User1.id === userId);
	return (
		<div className="flex flex-col gap-5 m-3 w-full">
			{userRelation.length === 0 ? (
				<EmptyList label="blocked" />
			) : (
				userRelation.map((relation) => (
					<div
						className="flex p-2 w-full rounded-lg shadow-lg shadow-black pl-3 justify-between"
						style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
						key={relation.id}
					>
						<Link
							to={`/users/${relation.User2.username}`}
							className="flex max-w-xs"
						>
							<img
								src={IMGURL + relation.User2.avatar}
								className="h-14 w-14 rounded-full shadow-lg shadow-black"
							/>
							<span className="m-3 block truncate flex-grow">
								{relation.User2.username}
							</span>
						</Link>
						<button
							className="mr-2"
							onClick={() => {
								unblockUser(relation.User2.id);
							}}
						>
							<CgUnblock />
						</button>
					</div>
				))
			)}
		</div>
	);
};

export default Blocked;
