import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { saveUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setError('');
            setLoading(true);

            const credentials = { email, password };

            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'שגיאה בתהליך ההתחברות');
            }

            const user = await response.json();

            saveUser(user);
            
            navigate('/');

        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-surface-container-low rounded-[2rem] overflow-hidden soft-glow">
                
                {/* Left Side: Brand Imagery & Welcome */}
                <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-surface-container">
                    <div className="absolute inset-0 opacity-20">
                        <img alt="Warm family dinner" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542037104843-0502011b66e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"/>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="material-symbols-outlined text-primary text-4xl" data-icon="family_history">family_history</span>
                            <span className="text-3xl font-extrabold tracking-tight text-primary font-headline">FamilySync</span>
                        </div>
                        <h1 className="text-5xl font-extrabold text-on-background leading-tight mb-6 font-headline">
                            התחברו הביתה,<br/>
                            <span className="text-primary">לסנכרן את הרגעים.</span>
                        </h1>
                        <p className="text-lg text-on-surface-variant max-w-md font-body leading-relaxed">
                            המרחב הדיגיטלי הפרטי שלכם לניהול לוח הזמנים, המשימות והזיכרונות של המשפחה במקום אחד.
                        </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-4 bg-surface/80 backdrop-blur-md p-4 rounded-xl w-fit mt-12">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-surface bg-primary text-on-primary flex items-center justify-center font-bold">י</div>
                            <div className="w-10 h-10 rounded-full border-2 border-surface bg-secondary text-on-secondary flex items-center justify-center font-bold">ד</div>
                            <div className="w-10 h-10 rounded-full border-2 border-surface bg-tertiary text-on-tertiary flex items-center justify-center font-bold">א</div>
                        </div>
                        <span className="text-sm font-medium text-on-surface-variant font-body px-2">הצטרפו לאלפי משפחות שכבר מסונכרנות</span>
                    </div>
                </div>

                {/* Right Side: Interaction Area */}
                <div className="p-8 md:p-16 bg-surface flex flex-col justify-center">
                    <div className="space-y-8 w-full max-w-md mx-auto" id="login-flow">
                        <header className="space-y-2 text-right">
                            <h2 className="text-3xl font-bold text-on-background font-headline">ברוכים השבים</h2>
                            <p className="text-on-surface-variant font-body">היכנסו לסלון הדיגיטלי של המשפחה שלכם.</p>
                        </header>
                        
                        {error && (
                            <div className="bg-error-container/20 border border-error/50 text-error px-4 py-3 rounded-xl text-right font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                            <div className="group">
                                <label className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant font-label text-right">כתובת אימייל</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-low focus:ring-2 focus:ring-primary-fixed text-on-background transition-all outline-none" 
                                    placeholder="hello@family.com" 
                                />
                            </div>
                            <div className="group">
                                <div className="flex justify-between mb-2 ml-1 flex-row-reverse">
                                    <label className="text-sm font-semibold text-on-surface-variant font-label">סיסמה</label>
                                </div>
                                <input 
                                    type="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-low focus:ring-2 focus:ring-primary-fixed text-on-background transition-all outline-none text-left" 
                                    placeholder="••••••••" 
                                    dir="ltr"
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-lg soft-glow hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                            >
                                {loading ? 'מתחבר...' : 'היכנס למערכת'}
                            </button>
                            
                            <p className="text-center text-on-surface-variant text-sm font-medium mt-6">
                                משפחה חדשה ב-FamilySync?{' '}
                                <Link to="/register" className="text-primary font-bold hover:underline">הרשמו כאן</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="fixed top-0 left-0 -z-10 w-64 h-64 bg-primary-container/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 -z-10 w-96 h-96 bg-secondary-container/20 blur-[120px] rounded-full pointer-events-none"></div>
        </div>
    );
};

export default Login;