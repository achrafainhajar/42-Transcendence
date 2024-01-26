import { useEffect, useRef, useState } from 'react';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import CreateRoom from './components/CreateRoom';
import { ChannelType, CreateChannelDto } from './channel-dto';
import GroupLogo from './assets/groups-logo.png';
import EmptyChat from './assets/Empty-chat.png';
import ShowMembers from './components/ShowMembers';
import useUser from '../../hooks/useUser';
import usePlayers from '../../hooks/usePlayers';
import JoinRoom from './components/JoinRoom';
import ShowRooms from './components/ShowRooms';
import LeaveChannel from './components/LeaveChannel';
import RemoveChannel from './components/RemoveChannel';
import RoomPassword from './components/RoomPassword';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../../socket';
import { IconContext } from 'react-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export interface Rooms {
	message: Message[];
	room_name: string;
	type: ChannelType;
	password?: string;
}
export interface channel {
	room_id: string;
	room_name: string;
	password?: string;
	type: ChannelType;
}
export interface Message {
	avatar: string;
	id: string;
	name: string;
	text: string;
}
export enum ChannelRole {
	OWNER = 'owner',
	ADMIN = 'admin',
	MEMBER = 'member',
}

export interface Member {
	id: string;
	username: string;
	role: ChannelRole;
	avatar: string;
}

const Channels = () => {
	const { chanelId } = useParams();
	const [message, setMessage] = useState<string>('');
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showMembers, setShowMembers] = useState<boolean>(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const passwordRef = useRef<boolean>(false);
	const [room, setroom] = useState<CreateChannelDto | null>(null);
	const [rooms, setrooms] = useState<CreateChannelDto[]>([]);
	const [members, setMembers] = useState<Member[]>([]);
	const [member, setMember] = useState<Member | null>(null);
	const { data: user } = useUser();
	const [status, setStatus] = useState(false);
	const navigate = useNavigate();
	const joinRef = useRef<channel | null>(null);
	const { isLoading } = usePlayers();
	/********************************************************/
	const target_id = chanelId;
	useEffect(() => {
		socket?.emit('GetMyChannels');
	}, [target_id]);

	useEffect(() => {
		const handleJoined = (data: any) => {
			setStatus(false);
			if (data && data.id) {
				joinRef.current = {
					room_id: data.id,
					room_name: data.name,
					password: data.password,
					type: data.type,
				};
				passwordRef.current = false;
			}
		};

		if (socket) {
			socket.on('joined', handleJoined);
		}

		return () => {
			if (socket) {
				socket.off('joined', handleJoined);
			}
		};
	}, [target_id]);
	/********************************************************/
	useEffect(() => {
		if (socket) {
			if (user && target_id) {
				joinRef.current = null;
				setMembers([]);
				setMessages([]);
				setMember(null);
				setStatus(false);
				socket.emit('JoinChannel', {
					room_id: target_id,
					user_id: user.id,
				});
			} else {
				setMembers([]);
				setMessages([]);
				setMember(null);
				joinRef.current = null;
			}
			setShowMembers(false);
		}
	}, [target_id]);
	/********************************************************/
	useEffect(() => {
		const emitTogetchannel = () => {
			if (socket) socket.emit('GetMyChannels');
		};
		const handleShowrooms = (data: any) => {
			const mapRoomsToDto = (room: any): CreateChannelDto => {
				return {
					id: room.id,
					name: room.name,
					type: room.type,
					password: room.password,
				};
			};
			const mappedRooms = data.map(mapRoomsToDto);
			setrooms(mappedRooms);
		};
		if (socket) {
			socket.on('getchannels', handleShowrooms);
			socket.on('goGetMychannels', emitTogetchannel);
		}

		return () => {
			if (socket) {
				socket.off('getchannels', handleShowrooms);
				socket.off('goGetMychannels', emitTogetchannel);
			}
		};
	}, [socket]);
	/********************************************************/
	useEffect(() => {
		if (room) {
			if (socket) socket.emit('AddChannel', room);
		}
	}, [room]);
	/********************************************************/
	useEffect(() => {
		if (socket && message && message != '') {
			socket.emit('AddMessage', {
				type: 'all',
				content: message,
				channel_id: target_id,
				user_id: user?.id,
			});
			setMessage('');
		}
	}, [message]);
	/********************************************************/
	useEffect(() => {
		if (socket) {
			socket.on('kicked', (data: string) => {
				if (joinRef.current && joinRef.current.room_id === data) {
					setMembers([]);
					setMessages([]);
					setMember(null);
					setShowMembers(false);
					navigate('/chat/rooms');
				}
			});
		}
	}, [joinRef.current, target_id]);
	/********************************************************/
	useEffect(() => {
		const handleRequirePassword = () => {
			setMembers([]);
			setMessages([]);
			setStatus(true);
			if (passwordRef.current) toast.error('Incorrect password !');
		};
		if (socket) {
			socket.on('requirePassword', handleRequirePassword);
		}
		return () => {
			if (socket) {
				socket.off('requirePassword', handleRequirePassword);
			}
		};
	}, [joinRef.current]);
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
						id: data.id,
						avatar: data.avatar,
						name: data.username,
						text: data.content,
					};
				};
				if (Array.isArray(data)) {
					const mappedMessages = data.map(mapMessagesToDto);
					if (mappedMessages) setMessages(mappedMessages);
				}
			}
		};
		if (socket) {
			socket.on('GoGetMyMessages', handleMymessage);
			socket.on('findallmessages', handleFind);
		}
		return () => {
			if (socket) {
				socket.off('findallmessages');
				socket.off('GoGetMyMessages');
			}
		};
	}, [joinRef.current]);
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
					let newMembers = data.map((member: any) => ({
						id: member.user_id,
						role: member.role,
						username: member.username,
						avatar: member.avatar,
					}));
					let tmp = newMembers.find((player: any) => player.id === user!.id);
					if (tmp !== undefined) setMember(tmp);
					setMembers(newMembers);
				}
			}
		};
		if (socket) {
			socket?.on('getMembers', handleMembers);
		}
		return () => {
			if (socket) socket?.off('getMembers', handleMembers);
		};
	}, [joinRef.current, isLoading]);
	/********************************************************/
	const onSend = (msg: string) => {
		setMessage(msg);
	};
	return (
		<div className="flex w-full h-full">
			<IconContext.Provider value={{ size: '1.5em' }}>
				<div
					className="w-1/3 md:w-1/4 h-full flex flex-col gap-2 pt-16 rounded-[40px] lg:rounded-[60px] shadow-lg shadow-black"
					style={{ backgroundColor: 'rgb(196, 226, 230, 0.5)' }}
				>
					<div className="w-full flex items-center justify-center gap-2 font-medium">
						{showModal && (
							<CreateRoom
								setroom={setroom}
								onClose={() => setShowModal(false)}
							/>
						)}
						<FontAwesomeIcon icon={faUsersRectangle} className="chat-icons" />
						<button onClick={() => setShowModal(true)}>Create Room</button>
					</div>
					<ShowRooms rooms={rooms} socket={socket} />
				</div>
				<div className="relative flex h-full w-2/3 md:w-3/4">
					<div
						className={`h-full rounded-[60px] shadow-lg shadow-black w-full ${
							showMembers && 'md:w-[70%]'
						}`}
						style={{
							backgroundColor: 'rgb(196, 226, 230, 0.5',
						}}
					>
						{joinRef.current && chanelId ? (
							<div className="w-full h-full flex flex-col py-5 lg:px-10">
								<div className="flex justify-between px-6 border-b-2 border-slate-100">
									<div className="flex items-center pb-2 gap-3">
										<img
											className="w-8 h-8 md:h-10 md:w-10"
											src={GroupLogo}
											alt="group-logo"
										/>
										<span className="truncate md:w-20 lg:w-40">
											{joinRef.current?.room_name}
										</span>
									</div>
									<div className="flex items-center gap-4">
										<LeaveChannel
											socket={socket}
											members={members}
											channel={joinRef.current}
											me={member}
											closeShowMember={setShowMembers}
										/>
										<button onClick={() => setShowMembers(!showMembers)}>
											<FontAwesomeIcon icon={faEye} className="chat-icons" />
										</button>
										{member?.role === ChannelRole.OWNER && (
											<RoomPassword join={joinRef.current} socket={socket} />
										)}
										{member?.role === ChannelRole.OWNER && (
											<RemoveChannel
												socket={socket}
												channel={joinRef.current}
												closeShowMember={setShowMembers}
											/>
										)}
									</div>
								</div>
								<MessageList messages={messages} />
								<MessageInput onSend={onSend} />
							</div>
						) : (
							<div className="flex flex-col justify-center items-center h-full">
								{status === true && user && (
									<JoinRoom
										room_id={target_id}
										socket={socket}
										user={user}
										passwordRef={passwordRef}
									/>
								)}
								<img
									className="w-60 md:w-fit"
									src={EmptyChat}
									alt="empty-chat"
								/>
							</div>
						)}
					</div>
					{showMembers && (
						<ShowMembers
							me={member}
							members={members}
							socket={socket}
							roomname={target_id}
						/>
					)}
				</div>
			</IconContext.Provider>
		</div>
	);
};

export default Channels;
