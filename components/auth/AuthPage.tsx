import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n/config';
import { Loader } from '../Loader';
import { XIcon } from '../icons/XIcon';
import { useSound } from '../../context/SoundContext';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
    onClose: () => void;
}

// This is a simple, insecure hash function for demonstration purposes only.
// In a real application, NEVER handle passwords on the client-side.
// Hashing should be done on the server with a strong, salted algorithm like bcrypt.
const simpleHash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return h.toString();
};

const AuthPage: React.FC<AuthPageProps> = ({ onClose }) => {
    const [mode, setMode] = useState<AuthMode>('register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const { t } = useTranslation();
    const { playClick, playSuccess } = useSound();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        playClick();
        setError(null);
        setIsLoading(true);

        // WARNING: Client-side hashing is insecure. This is a mock for the demo.
        const passwordHash = simpleHash(password);

        try {
            if (mode === 'login') {
                const user = await login(email, passwordHash);
                if (!user) {
                    setError(t('auth.invalidCredentials'));
                } else {
                    playSuccess();
                    onClose();
                }
            } else {
                const user = await register(email, passwordHash);
                if (!user) {
                    setError(t('auth.emailInUse'));
                } else {
                    playSuccess();
                    onClose();
                }
            }
        } catch (err) {
            setError(t('auth.genericError'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleMode = () => {
        playClick();
        setMode(prev => prev === 'login' ? 'register' : 'login');
        setError(null);
        setEmail('');
        setPassword('');
    }

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 relative"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold tracking-wider">
                        <span className="text-indigo-400">{t('appTitle.virtual')}</span> {t('appTitle.remodelAI')}
                    </h1>
                </div>
            
                <h2 className="text-2xl font-bold text-center mb-6">
                    {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">{t('auth.email')}</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">{t('auth.password')}</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center text-lg"
                    >
                        {isLoading ? <Loader small /> : (mode === 'login' ? t('auth.loginButton') : t('auth.registerButton'))}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-400 mt-6">
                    {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                    <button onClick={toggleMode} className="font-medium text-indigo-400 hover:text-indigo-300">
                        {mode === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;