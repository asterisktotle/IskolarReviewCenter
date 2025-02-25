import { Img } from '@chakra-ui/react';

const EmailVerify = () => {
	return (
		<div className="flex w-full items-center flex-col">
			<Img
				src="../../public/verify-email-2748674-2289734.png"
				w={'200px'}
				alt="iskolar"
			/>

			<Img src="../../public/Success.gif" w={'200px'} alt="iskolar" />

			<p>Thanks for Signing Up!</p>
			<h1>Please Verify Your Email!</h1>
		</div>
	);
};

export default EmailVerify;
