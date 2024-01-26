import { useState } from 'react';
import { Member, ChannelRole } from '../Channels';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUserShield } from '@fortawesome/free-solid-svg-icons';
import InviteGame from '../assets/invite-game.png';
import { IMGURL } from '../../../constants';

interface Props {
	members: Member[] | null;
	socket: Socket | null;
	roomname: string | undefined;
	me: Member | null;
}

const ShowMembers = ({ me, members, socket, roomname }: Props) => {
	const navigate = useNavigate();
	const [showMode, setShowMode] = useState(false);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);

	const handleMemberClick = (member: Member) => {
		if (selectedMember === member) {
			setShowMode(false);
			setSelectedMember(null);
		} else {
			setSelectedMember(member);
		}
	};
	const handleSet = (
		user_id: string,
		channel_id: string,
		target_id: string,
		role: string
	) => {
		if (socket) {
			socket.emit('SetRole', {
				user_id: user_id,
				channel_id: channel_id,
				target_id: target_id,
				role: role,
			});
		}
	};
	const handleKick = (
		user_id: string,
		channel_id: string,
		target_id: string
	) => {
		if (socket) {
			socket.emit('Kick', {
				user_id: user_id,
				channel_id: channel_id,
				target_id: target_id,
			});
		}
	};
	const handleBan = (
		user_id: string,
		channel_id: string,
		target_id: string
	) => {
		if (socket) {
			socket.emit('Ban', {
				user_id: user_id,
				channel_id: channel_id,
				target_id: target_id,
			});
		}
	};
	const handleMute = (
		user_id: string,
		channel_id: string,
		target_id: string
	) => {
		if (socket) {
			socket.emit('Mute', {
				user_id: user_id,
				channel_id: channel_id,
				target_id: target_id,
			});
		}
	};
	const handleProfile = (
		user_id: string,
		channel_id: string,
		target_name: string
	) => {
		if (socket && channel_id && user_id && target_name) {
			navigate(`/users/${target_name}`);
		}
	};
	const handleDM = (user_id: string, target_id: string) => {
		if (socket && user_id && target_id) {
			navigate(`/chat/direct-messages/${target_id}`);
		}
	};
	const handleInvite = (user_id: string, target_id: string, mode: string) => {
		if (user_id && target_id && socket && mode) {
			socket.emit('InviteToGame', { target_id: target_id, mode: mode });
		}
	};
	return (
		<div
			className="absolute top-[61px] bottom-0 md:static z-10 backdrop-blur-sm md:backdrop-blur-0 md:h-full flex flex-col items-center w-full md:w-[30%] rounded-[40px] pt-5 shadow-lg shadow-black"
			style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
		>
			<span
				className="border-b-2 py-2 text-center"
				style={{ borderColor: '#d34813' }}
			>
				Group Members
			</span>
			<ul className="flex w-full h-full max-h-full overflow-y-auto items-center flex-col pt-5 gap-3">
				{members?.map((member) => (
					<li key={member.id} className="w-full">
						<div className="relative w-full flex justify-center md:justify-start md:px-1 lg:px-6">
							<div className="flex gap-2 ">
								<button
									onClick={() => {
										navigate(`/users/${member.username}`);
									}}
								>
									<img
										className="rounded-full w-8 h-8"
										src={IMGURL + member.avatar}
										alt={member.username}
									/>
								</button>
								<button
									className="flex gap-1 items-center text-sm font-medium"
									onClick={() => {
										handleMemberClick(member);
									}}
								>
									<span className="text-start text-xs lg:text-sm truncate max-w-[64px] md:max-w-[40px] lg:w-16">
										{member.username}
									</span>
									{member.role === 'owner' && (
										<FontAwesomeIcon icon={faUserShield} />
									)}
									{me && me != member && (
										<FontAwesomeIcon
											icon={faAngleDown}
											className="chat-icons"
											style={{ color: '#D34813' }}
										/>
									)}
								</button>
							</div>
							{selectedMember === member && me && me != member && (
								<div
									className="absolute z-10 w-[80%] md:w-[95%] top-10 right-1 left-1 backdrop-blur-3xl flex flex-col gap-1 rounded-lg p-1 bg-opacity-50 text-white text-xs md:text-[8px] lg:text-xs"
									style={{ backgroundColor: 'rgb(10, 89, 139, 0.5)' }}
								>
									{!showMode ? (
										<button
											onClick={() => {
												setShowMode(true);
											}}
											className="w-full flex gap-2 items-center justify-center rounded-full p-2"
											style={{ backgroundColor: '#350F50' }}
										>
											<img
												src={InviteGame}
												className="w-6 h-6 md:w-10 md:h-10"
												alt="invite-game"
											/>
											INVITE TO GAME
										</button>
									) : (
										<div className="flex gap-2 w-full">
											<button
												className="rounded-full p-2 flex-1"
												style={{ backgroundColor: '#350F50' }}
												onClick={() => {
													handleInvite(me.id, member.id, 'classic');
													setShowMode(false);
												}}
											>
												Classic
												<br />
												mode
											</button>
											<button
												className="rounded-full p-2 flex-1"
												style={{ backgroundColor: '#350F50' }}
												onClick={() => {
													handleInvite(me.id, member.id, 'power');
													setShowMode(false);
												}}
											>
												Power
												<br />
												mode
											</button>
										</div>
									)}
									<div className="flex gap-1">
										<button
											className="w-full rounded-full p-2"
											style={{ backgroundColor: '#D9D9D9' }}
											onClick={() => {
												handleProfile(me.id, roomname!, member.username);
											}}
										>
											PROFILE
										</button>
										<button
											className="w-full rounded-full p-2"
											style={{ backgroundColor: '#D9D9D9' }}
											onClick={() => {
												handleDM(me.id, member.id);
											}}
										>
											DM
										</button>
									</div>
									{(me.role === ChannelRole.OWNER ||
										(me.role === ChannelRole.ADMIN &&
											member.role !== ChannelRole.OWNER &&
											member.role !== ChannelRole.ADMIN)) && (
										<>
											<div className="flex gap-1">
												<button
													className="w-full rounded-full p-2"
													style={{ backgroundColor: '#202C35' }}
													onClick={() => {
														handleMute(me.id, roomname!, member.id);
													}}
												>
													MUTE
												</button>
												<button
													className="w-full rounded-full p-2"
													style={{ backgroundColor: '#202C35' }}
													onClick={() => {
														handleKick(me.id, roomname!, member.id);
													}}
												>
													KICK
												</button>
											</div>
											<button
												className="w-full rounded-full p-2"
												style={{ backgroundColor: '#202C35' }}
												onClick={() => {
													handleBan(me.id, roomname!, member.id);
												}}
											>
												BAN
											</button>
										</>
									)}
									{member.role === ChannelRole.ADMIN &&
										me.role === ChannelRole.OWNER && (
											<button
												style={{ backgroundColor: '#462F68' }}
												className="w-full rounded-full p-2"
												onClick={() => {
													handleSet(me.id, roomname!, member.id, 'member');
												}}
											>
												UNSET ADMIN
											</button>
										)}
									{member.role != ChannelRole.ADMIN &&
										me.role === ChannelRole.OWNER && (
											<button
												style={{ backgroundColor: '#462F68' }}
												className="w-full rounded-full p-2"
												onClick={() => {
													handleSet(me.id, roomname!, member.id, 'admin');
												}}
											>
												SET ADMIN
											</button>
										)}
								</div>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ShowMembers;
