import { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import Achievement from './Achievement';
import History from './History';
import EditProfileModal from './EditProfileModal';
import { IMGURL } from '../../constants';
import Loading from '../Loading';
import OTPInputComponent from './OTPInputComponent';
import apiClient from '../../services/api-client';
import usePageStore from '../../stores/pageStore';
import { faCircleUser, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Profile = () => {
	const { data: user, error, isLoading, refetch: refetchUser } = useUser();
	const [showModal, setShowModal] = useState(!user?.is_profile_finished);
	const [showModal2FA, setShowModal2FA] = useState(false);
	const [twofa, settwofa] = useState(false);
	const setPage = usePageStore((s) => s.setPage);
	useEffect(() => {
		settwofa(user?.two_factor_auth_enabled || false);
	}, [user]);

	useEffect(() => {
		setPage('/profile');
	}, []);

	if (isLoading) return <Loading />;

	if (error || !user) return <></>;
	return (
		<div
			className="flex flex-col w-full items-center"
			style={{ color: '#072083' }}
		>
			<div className="bg-[#c4e2e680] w-[500px] max-w-full min-h-72 rounded-lg flex flex-col items-center p-4 gap-5 relative">
				<button
					className=" rounded full p-2 hover:text-blue-900 absolute left-0 top-0"
					onClick={() => setShowModal(true)}
				>
					<FontAwesomeIcon icon={faEdit} className="side-icons" />
				</button>
				<button
					className="h-10 rounded full p-2  shadow-sm absolute right-0 top-0"
					onClick={() => setShowModal2FA(true)}
				>
					<label className="relative inline-flex items-center cursor-pointer ">
						<input
							type="checkbox"
							value=""
							className="sr-only peer"
							checked={twofa}
							onChange={() => {}}
						/>
						<div className="w-11 h-6 bg-[#072083] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
						<span className="ms-3 text-sm font-medium ">2FA</span>
					</label>
				</button>
				<img
					src={IMGURL + user.avatar}
					className="h-28 w-28 lg:h-40 lg:w-40 rounded-full shadow-lg shadow-black"
				/>

				<div className="flex gap-2 md:px-5 md:py-1 items-center justify-start w-full">
					<FontAwesomeIcon icon={faCircleUser} className="side-icons" />
					<div className="block truncate flex-grow">
						{user.username ?? 'Username is not set'}
					</div>
				</div>

				<div className="flex gap-2 md:px-5 md:py-1 items-center justify-start w-full">
					<svg
						className="w-8 h-8 min-w-[32px] "
						fill="currentColor"
						viewBox="0 0 1920 1920"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g
							id="SVGRepo_tracerCarrier"
							strokeLinecap="round"
							strokeLinejoin="round"
						></g>
						<g id="SVGRepo_iconCarrier">
							<path
								d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z"
								fillRule="evenodd"
							></path>
						</g>
					</svg>
					<div className="block truncate flex-grow">
						{user.email ?? 'Email is not set'}
					</div>
				</div>
			</div>
			{showModal && (
				<EditProfileModal
					visible={showModal}
					onClose={() => setShowModal(false)}
				/>
			)}
			{showModal2FA && (
				<OTPInputComponent
					canClose={true}
					generateSecret={!user?.two_factor_auth_enabled}
					postSubmit={async ({ otp, secret }) => {
						const res = await apiClient.post(`/auth/update2fa`, {
							secret: secret,
							code: otp,
							status: !user?.two_factor_auth_enabled,
						});
						await refetchUser();
						return res;
					}}
					onClose={() => setShowModal2FA(false)}
				/>
			)}

			{user.is_profile_finished && (
				<div className="flex h-1/2 w-full p-5 gap-5 text-sm lg:text-2xl">
					<Achievement id={user.id} />
					<History />
				</div>
			)}
		</div>
	);
};

export default Profile;
