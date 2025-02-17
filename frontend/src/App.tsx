import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import SignUpForm from './pages/Login';

const App = () => {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<SignUpForm />} />
				<Route path="/email-verify" element={<EmailVerify />} />
				<Route path="/reset-password" element={<ResetPassword />} />
			</Routes>
		</div>
	);
};

export default App;
