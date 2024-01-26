import { MutableRefObject, useRef } from 'react';
import { Socket } from 'socket.io-client';
import User from '../../../entities/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

interface Props {
	room_id: string | undefined;
	socket: Socket | null;
	user: User;
	passwordRef: MutableRefObject<boolean>;
}

const JoinRoom = ({ room_id, socket, user, passwordRef }: Props) => {
	const uname = useRef<HTMLInputElement | null>(null);
	const handleJoinClick = (room_id: string, password: string) => {
		if (socket) {
			socket.emit('JoinChannel', {
				room_id: room_id,
				user_id: user?.id,
				password: password,
			});
			passwordRef.current = true;
		}
	};

	return (
		<div className="p-5 flex gap-2">
			<input
				type="password"
				placeholder="Enter a group name"
				ref={uname}
				className="rounded-lg px-2"
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						if (room_id && uname.current !== null && uname.current.value) {
							handleJoinClick(room_id, uname.current.value);
						}
					}
				}}
			/>
			<button
				onClick={() => {
					if (room_id && uname.current !== null && uname.current.value) {
						handleJoinClick(room_id, uname.current.value);
					}
				}}
			>
				<FontAwesomeIcon icon={faCircleArrowRight} />
			</button>
		</div>
	);
};

export default JoinRoom;
