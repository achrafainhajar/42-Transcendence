import { Socket } from 'socket.io-client';
import { ChannelRole, Member, channel } from '../Channels';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { IMGURL } from '../../../constants';

interface Props {
	socket: Socket | null;
	members: Member[];
	me: Member | null;
	channel: channel | null;
	closeShowMember: (show: boolean) => void;
}
const LeaveChannel = ({
	socket,
	members,
	me,
	channel,
	closeShowMember,
}: Props) => {
	const [show, setShow] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const handleMouseClick = (event: MouseEvent) => {
		if (ref && ref.current && !ref.current.contains(event.target as Node))
			setShow(false);
	};
	useEffect(() => {
		document.addEventListener('mousedown', handleMouseClick);

		return () => {
			document.removeEventListener('mousedown', handleMouseClick);
		};
	}, []);
	const handleLeave = (target_id: string | null) => {
		setShow(false);
		if (socket && channel && !target_id) {
			socket.emit('leaveChannel', { channel_id: channel.room_id });
		} else if (socket && channel) {
			socket.emit('leaveChannel', {
				target_id: target_id,
				channel_id: channel.room_id,
			});
		}
		closeShowMember(false);
	};

	return (
		<div className="relative" ref={ref}>
			<button onClick={() =>{
				setShow(!show);
				if(me?.role !== ChannelRole.OWNER || members.length == 1)
				handleLeave(null);
			}}>
				<FontAwesomeIcon icon={faRightFromBracket} className="chat-icons" />
			</button>
			{show && (
				<>
					{members.length > 1 && me?.role === ChannelRole.OWNER ? (
						<ul className="absolute z-20 right-0 w-28 md:w-36 flex gap-1 bg-gray-100 p-1 px-2 max-h-96 rounded-lg bg-opacity-90 shadow-md shadow-black">
							{members.map((member) => {
								if (me !== member) {
									return (
										<li key={member.id}>
											<button
												className="flex items-center gap-2 w-full"
												onClick={() => handleLeave(member.id)}
											>
												<img
													className="w-8 h-8 rounded-full"
													src={IMGURL + member.avatar}
													alt="member"
												/>
												<span className="block truncate flex-grow max-w-[50px] md:max-w-[100px]">
													{member.username}
												</span>
											</button>
										</li>
									);
								}
								return null;
							})}
						</ul>
					) : (
						<></>
					)}
				</>
			)}
		</div>
	);
};

export default LeaveChannel;
