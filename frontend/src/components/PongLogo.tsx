import pongLogo from '../assets/pong-logo.webp';

const PongLogo = () => {
	return (
		<div className="flex justify-center">
			<img src={pongLogo} className="w-1/2" />
		</div>
	);
};

export default PongLogo;
