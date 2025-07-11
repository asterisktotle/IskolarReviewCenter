import { useAuth } from '../hooks/useAuth'; // Adjust import path as needed
import AdminDashBoard from './Admin/AdminDashBoard'; // Adjust import path as needed
import UsersLecture from './User/UserLecture'; // Adjust import path as needed

const Home = () => {
	const { userData } = useAuth();
	console.log('userdata: ', userData);

	if (userData?.isAdmin) {
		return <AdminDashBoard />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

				{/* Main Content */}
				<div className="relative px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						{/* Welcome Section */}
						<div className="pt-16 pb-20 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
							<div className="text-center">
								{/* Greeting */}
								<div >
									<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight">
										Hello
									</h1>
									<div className="mt-4 sm:mt-6">
										<span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-purple-300">
											{userData ? userData.name : 'Developer'}
										</span>
									</div>
								</div>

								{/* Welcome Message */}
								<div className="mx-auto max-w-3xl mb-12 sm:mb-16">
									<p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
										Welcome back! Ready to continue your learning journey?
									</p>
								</div>

								{/* Status Indicators */}
								{userData && (
									<div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 sm:mb-12">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
										<span className="text-sm font-medium text-gray-200">
											{!userData.isAccountVerified
												? 'Account Verified'
												: 'Account Pending Verification'}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="relative">
				{/* Section Divider */}
				<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

				{/* Users Lecture Component */}
				<div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
					<div className="mx-auto max-w-7xl">
						{/* Section Header */}
						<div className="text-center mb-12 sm:mb-16">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
								Your Learning Dashboard
							</h2>
							<p className="text-gray-400 text-lg max-w-2xl mx-auto">
								Track your progress and continue where you left off
							</p>
						</div>

						{/* Users Lecture Component Wrapper */}
						<div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 lg:p-12 shadow-2xl">
							<UsersLecture />
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Gradient */}
			<div className="h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
		</div>
	);
};

export default Home;
