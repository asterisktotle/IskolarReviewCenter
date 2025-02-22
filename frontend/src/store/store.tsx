import axios from 'axios';
import { object } from 'zod';
import { create } from 'zustand';

interface UserData {
	name: string;
	isAccountVerified: boolean;
}

interface AuthStore {
	// Form display states
	isLogin: boolean;
	isRegister: boolean;
	showPassword: boolean;
	showConfirmPassword: boolean;

	//  Form values
	email: string;
	password: string;

	// Error state
	incorrectPassword: boolean;
	noUserEmail: boolean;

	userData: UserData | null;

	//Setters
	setIsLogin: (value: boolean) => void;
	setIsRegister: (value: boolean) => void;
	setUserData: (data: UserData) => void;
	togglePassword: () => void;
	togglePasswordConfirm: () => void;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	setIncorrectPassword: (value: boolean) => void;
	setNoUserEmail: (value: boolean) => void;

	//API Keys
	backendUrl: string;

	//API Operation
	getUserData: () => Promise<void>;
	getAuth: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
	//Initial values
	isLogin: false,
	isRegister: true,
	showPassword: false,
	showConfirmPassword: false,
	email: '',
	password: '',
	incorrectPassword: false,
	noUserEmail: false,
	backendUrl: import.meta.env.VITE_BACKEND_URL,
	userData: null,

	// Setters
	setIsLogin: (value) => set({ isLogin: value }),
	setIsRegister: (value) => set({ isRegister: value }),
	togglePassword: () => set((state) => ({ showPassword: !state.showPassword })),
	togglePasswordConfirm: () =>
		set((state) => ({
			showConfirmPassword: !state.showConfirmPassword,
		})),
	setEmail: (email) => set({ email }),
	setPassword: (password) => set({ password }),
	setIncorrectPassword: (value) => set({ incorrectPassword: value }),
	setNoUserEmail: (value) => set({ noUserEmail: value }),
	setUserData: (data) => set({ userData: data || null }),

	getUserData: async () => {
		const { backendUrl, setUserData } = get();

		try {
			axios.defaults.withCredentials = true;
			const { data } = await axios.get(backendUrl + '/api/user/data');

			if (data.success) {
				setUserData(data.userData);
			} else if (!data.success) {
				console.log('data unsuccess: ', data.message);
				setUserData(null);
			}
		} catch (err) {
			console.log('getuserdata err: ', err.message);
			setUserData(null);
			throw err;
		}
	},
	getAuth: async () => {
		const { backendUrl, setIsLogin, getUserData } = get();
		try {
			const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
			if (data.success) {
				setIsLogin(true);
				await getUserData();
			} else {
				setIsLogin(false);
			}
		} catch (err) {
			setIsLogin(false);
			throw err;
		}
	},
}));

export default useAuthStore;
