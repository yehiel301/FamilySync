import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [familyCode, setFamilyCode] = useState(''); // New state for family code
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);

            const newUser = {
                name,
                email,
                password,
                familyName,
                familyCode, // Include family code in the request
            };

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.status === 409) {
                throw new Error('משתמש עם אימייל זה כבר קיים');
            }
            if (response.status === 400) {
                throw new Error('קוד משפחתי לא תקין');
            }
            if (!response.ok) {
                throw new Error('שגיאה בתהליך ההרשמה');
            }

            alert('ההרשמה בוצעה בהצלחה! כעת תוכל להתחבר.');
            navigate('/login');

        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background">
            <div className="max-w-4xl w-full bg-surface-container-low rounded-[2rem] overflow-hidden soft-glow shadow-2xl">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <header className="space-y-2 text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary text-4xl">family_history</span>
                            <span className="text-3xl font-extrabold tracking-tight text-primary font-headline">FamilySync</span>
                        </div>
                        <h2 className="text-3xl font-bold text-on-background font-headline">יצירת חשבון או הצטרפות</h2>
                        <p className="text-on-surface-variant font-body">הצטרפו למשפחה קיימת עם קוד, או הקימו אחת חדשה.</p>
                    </header>

                    {error && (
                        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-center font-medium mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant font-label text-right">השם המלא שלך</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-high focus:ring-2 focus:ring-primary text-on-background transition-all outline-none"
                                    placeholder="ישראל ישראלי"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant font-label text-right">שם המשפחה</label>
                                <input
                                    type="text"
                                    required
                                    value={familyName}
                                    onChange={(e) => setFamilyName(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-high focus:ring-2 focus:ring-primary text-on-background transition-all outline-none"
                                    placeholder="לדוגמא: כהן"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant font-label text-right">כתובת אימייל (לכניסה)</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-high focus:ring-2 focus:ring-primary text-on-background transition-all outline-none text-left"
                                    placeholder="hello@family.com"
                                    dir="ltr"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant font-label text-right">סיסמה</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-high focus:ring-2 focus:ring-primary text-on-background transition-all outline-none text-left"
                                    placeholder="••••••••"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-outline-variant/30">
                             <label className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant font-label text-right">קוד משפחתי (אופציונלי)</label>
                             <input
                                type="text"
                                value={familyCode}
                                onChange={(e) => setFamilyCode(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-high focus:ring-2 focus:ring-primary text-on-background transition-all outline-none text-center tracking-widest font-mono"
                                placeholder="הזן קוד כדי להצטרף למשפחה קיימת"
                            />
                        </div>


                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-br from-primary to-tertiary text-on-primary rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'מעבד בקשה...' : 'הרשמה וחיבור'}
                            </button>
                        </div>

                        <p className="text-center text-on-surface-variant text-sm font-medium pb-4">
                            המשפחה כבר רשומה?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">התחברו כאן</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;