import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';

import AuthenticatedRoute from './AuthRoute';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import AdminDashBoard from './pages/Admin/AdminDashBoard';
import AccountSettings from './pages/AccountSettings';
import SimpleSidebar from './components/SideBar';
import AdminLectures from './pages/Admin/AdminLectures';
import UsersLecture from './pages/User/UserLecture';
import AdminTests from './pages/Admin/AdminTests';
import UserTests from './pages/User/UserTests';
import ViewPdf from './pages/PdfViewer';
import UserPlayQuiz from './pages/Quiz/UserPlayQuiz';
import NotFound from './pages/NotFoundFallBack';
import AuthenticationPage from './pages/AuthenticationPage';

const App = () => {
	const getAuth = useAuthStore((state) => state.getAuth);
	const { userData } = useAuthStore();

	useEffect(() => {
		getAuth();
	
	}, [getAuth]);

	const isAuthPage = location.pathname === '/';


		return (
		<>
			{isAuthPage ? (
		
				<div className="min-h-screen">
					<Routes>
						<Route path="/" element={<AuthenticationPage />} />
					</Routes>
				</div>
			) : (
				// All other pages with shared background design
				<div className="min-h-screen relative overflow-hidden">
			
				<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
					{/* Background Pattern */}
					<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

					{/* Gradient Orbs */}
					<div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
					<div className="absolute top-0 -right-4 w-72 h-72 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-20  "></div>
					<div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20  "></div>
				</div>

				{/* Content Wrapper */}
				<div className="relative z-10 text-white">
				{/* Content Wrapper */}
			
						<Routes>
							<Route path="/sidebar" element={<SimpleSidebar />} />

							{/* Protected routes */}
							<Route element={<AuthenticatedRoute />}>
								<Route path="/view-pdf/:pdfId" element={<ViewPdf />} />
								<Route path="/dashboard" element={<Home />} />
								<Route path="/email-verify" element={<EmailVerify />} />
								<Route path="/reset-password" element={<ResetPassword />} />
								<Route path="/account-settings" element={<AccountSettings />} />

								{/* ADMIN */}
								{userData?.isAdmin && (
									<>
										<Route path="/admin-dashboard" element={<AdminDashBoard />} />
										<Route path="/admin-lectures" element={<AdminLectures />} />
										<Route path="/admin-tests" element={<AdminTests />} />
									</>
								)}

								{/* USER */}
								{!userData?.isAdmin && (
									<>
										<Route path="/user-tests" element={<UserTests />} />
										<Route path="/user-lectures" element={<UsersLecture />} />
										<Route
											path="/user-tests/play/:quizId"
											element={<UserPlayQuiz />}
										/>
									</>
								)}
								
								{/* Fallback */}
								<Route path="*" element={<NotFound />} />
							</Route>
						</Routes>
					
				</div>
				
				{/* Additional Styling for specific pages can be added here */}
		
					
					
				</div>
			)}
		</>
		)
};

export default App;
