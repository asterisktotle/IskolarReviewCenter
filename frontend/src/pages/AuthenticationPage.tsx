import {
	Card,
		Image,
	Text,
} from '@chakra-ui/react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SignInForm from './Authentication/SignInForm';
import SignUpForm from './Authentication/SignUpForm';
import ForgotPasswordForm from './Authentication/ForgotPassForm';
import OTPForm from './Authentication/OTPForm';
import StarsBackground from '../components/StarsBackground';
// Supports weights 100-900



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
		<div className="flex flex-col md:flex-row min-h-screen">
      <StarsBackground />
    {/* Content section - separate from background */}
    <div className="flex-1 md:flex-2 flex items-center justify-center order-1 md:order-1">
      		
        <Card
          shadow={'xl'}
          marginBlock={'1'}
          bgGradient={''}
          marginInline={{ sm: 0, base: -5 }}
          px={19}
		      py={20}
          rounded={'lg'}
          bgColor={'gray.900'}
          align={'center'}
          borderWidth={0}
          gap={4}
        >
			<Image
		  src="/iskolar.png"
          alt="iskolar logo"
          w={'10rem'}
        />

          {renderForm()}
        </Card>
    </div>

    {/* Right background with image */}
    <div className="flex-1 hidden md:flex md:flex-2 overflow-hidden relative order-1 md:order-2 min-h-[50vh] md:min-h-screen">
      <Card 
        position={{ base: 'relative', md: 'absolute' }}
        top={{ base: 'auto', md: '30%' }}
        left={{ base: 'auto', md: 'auto' }}
        margin={{ base: 'auto', md: '0' }}
        mt={{ base: 4, md: 0 }}
        width={'fit-content'}
        // bgColor={'gray.100'}
        border={'0'}
		    paddingBlock={10}
		    paddingInline={10}
        roundedTopRight={80}
        roundedBottomLeft={70}

      >
        <Text 
          lineHeight={'0.5'} 
          fontSize={{ base: '0.5vw', md: '2vw' }}
          textColor={'gray.400'}
        >
          Make your mama proud
        </Text>
        <Text 
          fontSize={{ base: '6vw', md: '4vw' }} 
          fontFamily={'sans-serif'}
        >
          Learn by
        </Text>
        <Text 
          fontSize={{ base: '8vw', md: '5vw' }} 
          lineHeight={'0.5'}
          textColor={'blue.300'}
          fontStyle={'italic'}
        >
          Looksfam
        </Text>
      </Card>
      
      <Image		
        zIndex={1}
        position={'absolute'}
        right={{ base: 2, md: 5 }}
        bottom={{ base: 2, md: 4 }}
        src="/welcome-astronaut.png"
        alt="astronaut"
        w={['10rem', '15vw', '20vw']} // scales with viewport width
        maxW="25rem"
        animation={'fade-in 300ms ease-out'}
      />
    </div>
  </div>

	);
};

export default AuthenticationPage;



	