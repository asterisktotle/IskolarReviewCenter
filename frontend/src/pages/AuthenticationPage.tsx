import {
	Box,
	Flex,	Image,
	VStack
} from '@chakra-ui/react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SignInForm from './Authentication/SignInForm';
import SignUpForm from './Authentication/SignUpForm';
import ForgotPasswordForm from './Authentication/ForgotPassForm';
import OTPForm from './Authentication/OTPForm';
import GrainySVGBackground from './GrainyBackground';



const AuthenticationPage = () => {
	const navigate = useNavigate();

	const {
		isLogin,
		authForm
	} = useAuthStore();




	useEffect(() => {
		if (isLogin) {
			navigate('/dashboard');
		}
	}, [isLogin, navigate]);

	


	//Form State Render
	const renderForm = () => {
    switch (authForm) {
      case 'signup':
        return <SignUpForm />;
      case 'signin':
        return <SignInForm />;
      case 'forgot-password':
        return <ForgotPasswordForm />;
	  case 'otp-form':
		return <OTPForm/>
      default:
        return null;
    }
  };
	return (
		 <div className="flex min-h-screen">
	
	{/* Content section - separate from background */}
	<div className="flex-1 flex items-center justify-center">
		<Flex>
			<VStack>
				<Image
					src="/iskolar.png"
					alt="iskolar logo"
					w={'10rem'}
				/>
				<Box
					backdropFilter="blur(10px)"
					shadow={'xl'}
					marginBlock={'1'}
					bgGradient={''}
					marginInline={{ sm: 0, base: -5 }}
					p={5}
					rounded={'lg'}
				>
					{renderForm()}
				</Box>
			</VStack>
		</Flex>
	</div>
	
	{/* Grainy background section - separate from content */}
	<div className="flex-2 overflow-hidden">
		<Image		position={'absolute'}
					right={0}
					src="/iskolar.png"
					alt="iskolar logo"
					w={'10rem'}
				/>
		<GrainySVGBackground/>
	</div>
	 
</div>

	);
};

export default AuthenticationPage;



	