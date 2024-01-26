import { Link, useNavigate } from 'react-router-dom';
import useRelationStatus from '../../../hooks/useRelationStatus';
import { ImBlocked } from 'react-icons/im';
import { useCallback } from 'react';
import apiClient from '../../../services/api-client';
import { IMGURL } from '../../../constants';
import Loading from '../../Loading';
import EmptyList from './EmptyList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { IoMdCloseCircle } from 'react-icons/io';

interface Props {
	userId: string;
}

const Friends = ({ userId }: Props) => {
	const {
		data: relations,
		error,
		isLoading,
		refetch,
	} = useRelationStatus('friends');
	const navigate = useNavigate();
	const sendRelationRequest = useCallback(
		async (playerId: string, relation: string, message: string) => {
			try {
				if (relation === 'unfriendUser') {
					await apiClient.delete(
						`/users/relationships/${playerId}/unfriendUser`
					);
				} else if (relation === 'blockUser') {
					await apiClient.put(`/users/relationships/${playerId}/blockUser`);
				}
				toast((t) => (
					<div className="flex justify-center gap-1 items-center">
						<span>{message}</span>
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
		},
		[]
	);
	if (isLoading) return <Loading />;
	if (error || !relations) return <></>;
	return (
		<div className="flex flex-col gap-5 m-3 w-full">
			{relations.length === 0 ? (
				<EmptyList label="friends" />
			) : (
				relations.map((relation) => {
					const friend =
						relation.User1.id === userId ? relation.User2 : relation.User1;
					return (
						<div
							className="flex p-2 w-full rounded-lg shadow-lg shadow-black pl-3 justify-between"
							style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
							key={relation.id}
						>
							<Link to={`/users/${friend.username}`} className="flex max-w-xs">
								<img
									src={IMGURL + friend.avatar}
									className="h-14 w-14 rounded-full shadow-lg shadow-black border-2"
									style={{
										borderColor: !friend.is_online
											? '#778899'
											: friend.is_in_game
											? '#FF8C00'
											: '#3CB371',
									}}
								/>
								<span className="m-3 block truncate flex-grow">
									{friend.username}
								</span>
							</Link>
							<div className="flex gap-5 mr-2">
								<button
									onClick={() => {
										sendRelationRequest(
											friend.id,
											'unfriendUser',
											'Player removed successfully !'
										);
									}}
								>
									<FontAwesomeIcon icon={faUserMinus} className="react-icons" />
								</button>
								<button
									onClick={() => navigate(`/chat/direct-messages/${friend.id}`)}
								>
									<FontAwesomeIcon icon={faMessage} className="react-icons" />
								</button>
								<button
									onClick={() => {
										sendRelationRequest(
											friend.id,
											'blockUser',
											'Player blocked successfully !'
										);
									}}
								>
									<ImBlocked />
								</button>
							</div>
						</div>
					);
				})
			)}
		</div>
	);
};

export default Friends;
