import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import SignUpForm from './pages/Login';
import AuthenticatedRoute from './AuthRoute';
import { useEffect } from 'react';
import useAuthStore from './store/store';
import AdminDashBoard from './pages/AdminDashBoard';
import AccountSettings from './pages/AccountSettings';

const App = () => {
	const getAuth = useAuthStore((state) => state.getAuth);

	useEffect(() => {
		getAuth();
	}, []);

	return (
		<div className="text-white px-10">
			<Routes>
				{/* Public routes */}
				<Route path="/login" element={<SignUpForm />} />

				{/* Protected routes */}
				<Route element={<AuthenticatedRoute />}>
					<Route path="/" element={<Home />} />
					<Route path="/admin" element={<AdminDashBoard />} />
					<Route path="/email-verify" element={<EmailVerify />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="/account-settings" element={<AccountSettings />} />
				</Route>
			</Routes>
		</div>
	);
};

export default App;
