import { ChannelType, CreateChannelDto } from '../channel-dto';
import { IoMdCloseCircle } from 'react-icons/io';
import toast from 'react-hot-toast';
import { ZodType, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

type RoomForm = {
	roomName: string;
	password?: string;
	roomType: ChannelType;
};
const schema: ZodType<RoomForm> = z.object({
	roomName: z
		.string()
		.min(2, 'Room name too short.')
		.max(51, 'Room name too long.'),
	password: z
		.string()
		.min(1, 'Password must have at least one charactere.')
		.max(20, 'Password too long.')
		.optional(),
	roomType: z.union([
		z.literal(ChannelType.PUBLIC),
		z.literal(ChannelType.PRIVATE),
		z.literal(ChannelType.PROTECTED),
	]),
});

interface Props {
	setroom: (roomData: CreateChannelDto) => void;
	onClose: () => void;
}

const CreateRoom = ({ setroom, onClose }: Props) => {
	const {
		watch,
		register,
		handleSubmit,
		setError,
		formState: { errors, isDirty, isValid },
		clearErrors,
		trigger,
		reset,
		resetField
	} = useForm<RoomForm>({
		resolver: zodResolver(schema),
		defaultValues: {
			roomType: ChannelType.PUBLIC,
			roomName: '',
		},
		mode: 'all',
	});
	const roomType = watch('roomType');
	let passValidator = watch('password');
	
	useEffect(() => {
		if (roomType !== ChannelType.PROTECTED) {
		resetField("password")
		clearErrors("password");
	};
	}, [roomType]);
	useEffect(()=>{
		console.log({errors,isDirty,isValid});
		
	},[errors,passValidator,roomType])
	const submitData = async (data: RoomForm) => {
		if (!isDirty || !isValid) return;
		if (data.roomType === ChannelType.PROTECTED && !data.password) {
			setError('password', {
				message: 'Protected channel must have password',
			});
			return;
		}
		// if (errors.) {
		// 	console.log({ errors });
		// 	return;
		// }
		if (data.roomName) {
			const roomData = {
				id: '',
				name: data.roomName,
				type: data.roomType,
				password:
					data.roomType === ChannelType.PROTECTED ? data.password : undefined,
			};
			setroom(roomData);
			onClose();
			toast.success('Room creaed Successfully!');
		}
	};
	return (
		<form
			className="fixed z-20 inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center md:px-20 text-sm lg:text-base"
			onSubmit={handleSubmit(submitData)}
		>
			<div className="container mx-auto relative bg-white min-h-64 text-center max-w-[485px] w-full p-4 sm:p-10 py-12 flex flex-col justify-start items-stretch gap-4 h-1/2 rounded-2xl  text-black ">
				<div
					className="w-auto place-self-end absolute right-1 top-1 text-blue-900 hover:text-blue-800 hover:cursor-pointer"
					onClick={onClose}
				>
					<IoMdCloseCircle />
				</div>
				<div className="flex gap-2 p-3 items-center text-start">
					<label>Room Name:</label>
					<input
						className="form-input py-2.5 px-4 w-full text-black border border-black/10 focus-visible:outline-none focus-visible:border-black rounded-lg placeholder:text-black/20  focus:border-black  focus:ring-0 focus:shadow-none;"
						type="text"
						{...register('roomName')}
					/>
				</div>
				{errors.roomName && (
					<div className="text-red-500">{errors.roomName.message} </div>
				)}
				<div className="flex gap-2 p-3 items-cente text-startr">
					<label>Room Type:</label>
					<select {...register('roomType')}>
						<option value={ChannelType.PUBLIC}>Public</option>
						<option value={ChannelType.PRIVATE}>Private</option>
						<option value={ChannelType.PROTECTED}>Protected</option>
					</select>
					{errors.roomType && (
						<div className="text-red-500">{errors.roomType.message} </div>
					)}
				</div>
				<div className="flex gap-2 p-3 items-center text-start">
					{roomType === ChannelType.PROTECTED && (
						<div>
							<div className="flex gap-2 p-3 items-center">
								<label>Password:</label>
								<input
									type="password"
									{...register('password')}
									placeholder="Password"
									className="form-input py-2.5 px-4 w-full text-black border border-black/10 focus-visible:outline-none focus-visible:border-black rounded-lg placeholder:text-black/20  focus:border-black  focus:ring-0 focus:shadow-none;"
								/>
							</div>
							{errors.password && (
								<div className="text-red-500">{errors.password.message} </div>
							)}
						</div>
					)}
				</div>

				<input
					disabled={!isDirty || !isValid}
					className="cursor-pointer py-2 px-4 bg-black w-full rounded-lg text-white text-lg font-semibold border border-black  hover:bg-transparent  hover:text-black  transition-all duration-300
          disabled:pointer-events-none disabled:opacity-60 disabled:cursor-auto"
					type="submit"
					value={'Create Room'}
				/>
			</div>
		</form>
	);
};

export default CreateRoom;
