import { useEffect, useRef, useState } from 'react';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { ChannelType, CreateChannelDto } from './channel-dto';
import { Member, Message, channel } from './Channels';
import EmptyChat from './assets/Empty-chat.png';
import InviteGame from './assets/invite-dm.png';
import useUser from '../../hooks/useUser';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ShowDms from './components/ShowDms';
import socket from '../../socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IMGURL } from '../../constants';
import { useNotificationStore } from '../../stores/notificationStore';
import toast from 'react-hot-toast';

const DirectMessages = () => {
	const [message, setMessage] = useState<string>('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [showMode, setShowMode] = useState(false);
	const [rooms, setrooms] = useState<CreateChannelDto[]>([]);
	const { data: user, isLoading } = useUser();
	const [member, setMember] = useState<Member | null>(null);
	const joinRef = useRef<channel | null>(null);
	const navigate = useNavigate();
	const { notifications, readNotification } = useNotificationStore();
	/********************************************************/
	const { dmId } = useParams();
	const target_id = dmId;
	useEffect(() => {
		socket?.emit('GetMyDms');
		if (target_id) {
			notifications
				.filter(
					(notification) =>
						notification.type === 'MESSAGE' &&
						notification.User.id === target_id
				)
				.forEach((notification) => {
					readNotification(notification);
				});
		}
	}, [target_id]);
	/********************************************************/
	useEffect(() => {
		const emitTogetchannel = () => {
			if (socket) socket.emit('GetMyDms');
		};
		const handleShowDms = (data: any) => {
			const mapRoomsToDto = (room: any): any => {
				return {
					id: room.id,
					name: room.name,
					target_id: room.target_id,
				};
			};
			const mappedRooms = data.map(mapRoomsToDto);
			setrooms(mappedRooms);
		};
		if (socket) {
			socket.on('ShowDms', handleShowDms);
			socket.on('goGetMyDms', emitTogetchannel);
		}
		return () => {
			if (socket) {
				socket.off('ShowDms', handleShowDms);
			}
		};
	}, [socket]);
	/********************************************************/
	useEffect(() => {
		if (target_id) {
			if (socket) {
				setMessages([]);
				setMember(null);
				socket.emit('CreateDm', {
					target_id: target_id,
					type: ChannelType.DM,
				});
				if (user) {
					socket.emit('JoinDm', {
						target_id: target_id,
						user_id: user.id,
					});
				}
			}
		} else {
			setMessages([]);
			joinRef.current = null;
		}
	}, [target_id, isLoading]);
	/********************************************************/
	useEffect(() => {
		if (socket && message) {
			socket.emit('AddMessage', {
				type: 'Dms',
				content: message,
				channel_id: joinRef.current?.room_id,
				user_id: user?.id,
				target_id: target_id,
			});
			setMessage('');
		}
	}, [message]);
	/********************************************************/
	useEffect(() => {
		const handleJoined = (data: any) => {
			if (data && data.id) {
				joinRef.current = {
					room_id: data.id,
					room_name: data.name,
					type: data.type,
				};
			}
		};

		if (socket) {
			socket.on('joined', handleJoined);
		}

		return () => {
			if (socket) {
				socket.off('joined');
			}
		};
	}, [target_id]);
	/********************************************************/
	useEffect(() => {
		const handleBlocked = () => {};
		if (socket && joinRef.current) {
			socket.on('blocked', handleBlocked);
			socket.on('kicked', (data: string) => {
				if (joinRef.current && joinRef.current.room_id === data) {
					setMessages([]);
					setMember(null);
					joinRef.current = null;
					navigate('/chat/direct-messages');
				}
			});
		}

		return () => {
			if (socket) {
				socket.off('kicked');
				socket.off('blocked');
			}
		};
	}, [joinRef.current, target_id]);
	/********************************************************/
	useEffect(() => {
		const handleMymessage = () => {
			socket?.emit('GetMyMessages', { channel_id: joinRef.current?.room_id });
		};
		const handleFind = (data: any) => {
			if (
				data &&
				(data.length === 0 ||
					data.some(
						(message: any) => message.channel_id === joinRef.current?.room_id
					))
			) {
				const mapMessagesToDto = (data: any): Message => {
					return {
						avatar: data.avatar,
						id: data.sender_id,
						name: data.username,
						text: data.content,
					};
				};
				if (Array.isArray(data)) {
					const mappedMessages = data.map(mapMessagesToDto);
					if (mappedMessages)
						//conjsole.log(mappedMessages);
						setMessages(mappedMessages);
				}
			}
		};
		if (socket) {
			socket.on('GoGetMyMessages', handleMymessage);
			socket?.on('findallmessages', handleFind);
		}

		return () => {
			if (socket) socket?.off('findallmessages', handleFind);
		};
	}, [joinRef]);
	/********************************************************/
	useEffect(() => {
		const handleMembers = (data: any) => {
			if (
				data &&
				data.some(
					(member: any) => member.channel_id === joinRef.current?.room_id
				)
			) {
				if (Array.isArray(data)) {
					let newMembers = data.find(
						(member: any) => member.user_id != user?.id
					);

					if (user && newMembers) {
						setMember({
							id: newMembers.user_id,
							role: newMembers.role,
							username: newMembers.username,
							avatar: newMembers.avatar,
						});
					}
				}
			}
		};
		if (socket) {
			socket.on('getmyMembers', handleMembers);
		}
		return () => {
			if (socket) socket.off('getmyMembers');
		};
	}, [joinRef.current, isLoading]);
	/********************************************************/
	const onSend = (msg: string) => {
		setMessage(msg);
	};
	const handleRemove = (channel_id: string | undefined) => {
		if (socket && channel_id) {
			socket.emit('removeChat', { channel_id: channel_id });
			toast.success('Chat deleted successfully !');
		}
	};
	/********************************************************/
	const handleInvite = (mode: string) => {
		if (user && target_id && user.id && socket && mode) {
			socket.emit('InviteToGame', { target_id: target_id, mode: mode });
		}
	};
	return (
		<div className="flex w-full h-full">
			<div
				className="w-1/3 md:w-1/4 h-full pt-16 rounded-[40px] lg:rounded-[60px] shadow-lg shadow-black"
				style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
			>
				<ShowDms rooms={rooms} socket={socket} />
			</div>
			<div
				className="w-2/3 md:w-3/4 h-full rounded-[60px] shadow-lg shadow-black"
				style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
			>
				{joinRef.current  && member ? (
					<div className="w-full h-full flex flex-col py-3 md:px-10">
						<div className="flex justify-between px-6 border-b-2 border-slate-100">
							<div className="flex items-center pb-2 gap-3">
								<button onClick={() => navigate(`/users/${member?.username}`)}>
									<img
										className="w-10 h-10 rounded-full"
										src={IMGURL + member?.avatar}
										alt="profule-user"
									/>
								</button>
								<button onClick={() => navigate(`/users/${member?.username}`)}>
									<span>{member?.username}</span>
								</button>
							</div>
							<div className="relative flex gap-2">
								<button
									onClick={() => {
										setShowMode(!showMode);
									}}
									className="w-full flex items-center justify-center p-2 rounded-full border"
								>
									<img
										src={InviteGame}
										className="w-6 h-6 md:w-10 md:h-10"
										alt="invite-game"
									/>
								</button>
								{showMode && (
									<div className="absolute mt-1 right-0 top-[100%] flex gap-2 ">
										<button
											className="rounded-lg p-2 flex-1"
											style={{ backgroundColor: 'rgb(196, 226, 230' }}
											onClick={() => {
												handleInvite('classic');
												setShowMode(false);
											}}
										>
											Classic
										</button>
										<button
											className="rounded-lg p-2 flex-1"
											style={{ backgroundColor: 'rgb(196, 226, 230' }}
											onClick={() => {
												handleInvite('power');
												setShowMode(false);
											}}
										>
											Power
										</button>
									</div>
								)}
								<button
									onClick={() => {
										handleRemove(joinRef.current?.room_id);
									}}
								>
									<FontAwesomeIcon icon={faTrash} className="dm-icons" />
								</button>
							</div>
						</div>
						<MessageList messages={messages} />
						<MessageInput onSend={onSend} />
					</div>
				) : (
					<div className="flex h-full justify-center items-center">
						<img className="w-60 md:w-fit" src={EmptyChat} alt="empty-chat" />
					</div>
				)}
			</div>
		</div>
	);
};

export default DirectMessages;
