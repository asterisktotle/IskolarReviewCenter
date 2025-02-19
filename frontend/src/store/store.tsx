import { create } from 'zustand';

// const [isRegister, setIsRegister] = useState(true);
//     const [showPassword, setShowPassword] = useState(true);
//     const [showPasswordConfirm, setShowPasswordConfirm] = useState(true);
//     const [incorrectPassword, setIncorrectPassword] = useState(false);
//     const [noUserEmail, setNoUserEmail] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

interface AuthStore {
	// Form display states
	isRegister: boolean;
	showPassword: boolean;
	showConfirmPassword: boolean;

	//  Form values
	email: string;
	password: string;

	// Error state
	incorrectPassword: boolean;
	noUserEmail: boolean;

	//Setters
	setIsRegister: (value: boolean) => void;
	togglePassword: () => void;
	togglePasswordConfirm: () => void;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	setIncorrectPassword: (value: boolean) => void;
	setNoUserEmail: (value: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
	//Initial values
	isRegister: true,
	showPassword: false,
	showConfirmPassword: false,
	email: '',
	password: '',
	incorrectPassword: false,
	noUserEmail: false,

	// Setters
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
}));

export default useAuthStore;
