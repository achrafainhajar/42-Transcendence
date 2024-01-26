import useRelationStatus from '../../../hooks/useRelationStatus';
import { useState } from 'react';
import InvitationCard from './InvitationCard';
import Loading from '../../Loading';
import EmptyList from './EmptyList';

interface Props {
	userId: string;
}
const Invitation = ({ userId }: Props) => {
	const [isSent, setIsSent] = useState(true);
	const { data: relations, error, isLoading } = useRelationStatus('pending');
	if (isLoading) return <Loading />;
	if (error || !relations) return <></>;
	const userRelation = !isSent
		? relations.filter((r) => r.User2.id === userId)
		: relations.filter((r) => r.User1.id === userId);
	return (
		<div className="flex flex-col gap-5 m-3 w-full">
			<div className="flex gap-5">
				<button
					className="bg-white w-full h-14 rounded-full p-2 text-2xl flex justify-center shadow-lg shadow-black"
					style={
						!isSent
							? { backgroundColor: 'rgb(196, 226, 230, 0.5)' }
							: { backgroundColor: 'rgb(196, 226, 230' }
					}
					onClick={() => setIsSent(true)}
				>
					Sent
				</button>
				<button
					className="bg-white w-full h-14 rounded-full p-2 text-2xl flex justify-center shadow-lg shadow-black"
					style={
						isSent
							? { backgroundColor: 'rgb(196, 226, 230, 0.5)' }
							: { backgroundColor: 'rgb(196, 226, 230' }
					}
					onClick={() => setIsSent(false)}
				>
					Received
				</button>
			</div>
			{userRelation.length === 0 && (
				<EmptyList label={isSent ? 'sent' : 'received'} />
			)}
			{userRelation.map((r) => (
				<InvitationCard relation={r} isSent={isSent} key={r.id} />
			))}
		</div>
	);
};

export default Invitation;
