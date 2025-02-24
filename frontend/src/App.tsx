import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import SignUpForm from './pages/Login';
import AuthenticatedRoute from './AuthRoute';

const App = () => {
	return (
		<div className="text-white">
			<Routes>
				{/* Public routes */}
				<Route path="/login" element={<SignUpForm />} />

				{/* Protected routes */}
				<Route element={<AuthenticatedRoute />}>
					<Route path="/" element={<Home />} />
					<Route path="/email-verify" element={<EmailVerify />} />
					<Route path="/reset-password" element={<ResetPassword />} />
				</Route>
			</Routes>
		</div>
	);
};

export default App;
