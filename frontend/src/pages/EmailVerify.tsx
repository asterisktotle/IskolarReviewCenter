import { Button, Img } from '@chakra-ui/react';
import useAuthStore from '../store/store';
import { useState } from 'react';

const EmailVerify = () => {
	const { sendOTPVerify, userData } = useAuthStore();
	const [isSent, setIsSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>(' ');
	const [message, setMessage] = useState<string>('');
	const [loading, setIsLoading] = useState(false);

	const handleSendEmail = async () => {
		setIsLoading(true);
		setErrorMessage('');
		// setIsSent(false)

		try {
			const data = await sendOTPVerify();

			if (!data.success) {
				console.log('error sending email: ', data.message);
				setErrorMessage(data.message);
				return;
			}

			setIsSent(true);
			setMessage(data.message);
		} catch (err) {
			console.log('error sending email catch:', err.message);
		} finally {
			setIsLoading(false);
		}
	};

	if (userData?.isAccountVerified) {
		return (
			<div className="flex w-full items-center flex-col mt-[15%] gap-4 ">
				<Img
					src="../../public/verify-email-2748674-2289734.png"
					w={'200px'}
					alt="iskolar logo"
				/>
				<p className="text-[1.75rem]"> Account is already verified</p>
			</div>
		);
	}

	return (
		<div className="flex w-full items-center flex-col mt-[15%] gap-4 ">
			<Img
				src="../../public/verify-email-2748674-2289734.png"
				w={'200px'}
				alt="iskolar"
			/>

			<div className="flex flex-col items-center gap-2">
				<div className="text-center">
					<p className="">Thanks for Signing Up!</p>
					<h1 className="!text-2xl text-pretty">Please Verify Your Email!</h1>
				</div>

				<Button onClick={handleSendEmail}>Send Email</Button>

				{errorMessage && <p className="text-red-400">{errorMessage}</p>}

				{isSent && (
					<div>
						<p>{message}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmailVerify;
