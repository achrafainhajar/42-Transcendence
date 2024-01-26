import { useEffect, useRef } from 'react';
import { IMGURL } from '../../../constants';
import useUser from '../../../hooks/useUser';
import Loading from '../../Loading';
import { Message } from '../Channels';
interface Props {
	messages: Message[];
}
const MessageList = ({ messages }: Props) => {
	const chatContainerRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (chatContainerRef.current) {
			const element = chatContainerRef.current;
			element.scrollTop = element.scrollHeight;
		}
	}, [messages]);
	const { data: user, isLoading, error } = useUser();
	if (isLoading) return <Loading />;
	if (error || !user) return <></>;
	return (
		<div className="w-full h-[79%] md:pt-5 mt-auto">
			<ul
				className="flex flex-col gap-2 max-h-full overflow-y-auto p-5"
				ref={chatContainerRef}
			>
				{messages.map((item, index) => (
					<li
						key={index}
						className={`flex gap-2 flex-grow w-fit max-w-[400px] break-all ${
							user.username === item.name ? 'ml-auto' : ''
						}`}
					>
						{user.username !== item.name && (
							<img
								src={IMGURL + item.avatar}
								alt="avatar"
								className="w-10 h-10 rounded-full"
							/>
						)}
						<div
							className="h-fit p-2 rounded-lg md:font-medium"
							style={{
								backgroundColor:
									user.username !== item.name
										? 'rgba(53, 15, 80, 0.2)'
										: '#FFFFFF',
							}}
						>
							{item.text}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default MessageList;
