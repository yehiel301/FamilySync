import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/he'; // Import Hebrew locale for moment
import { useUser } from '../UserContext';

// Helper component for empty states
const EmptyState = ({ icon, text }) => (
    <div className="text-center py-8 text-on-surface-variant bg-surface rounded-xl border border-dashed border-outline-variant/50">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">{icon}</span>
        <p>{text}</p>
    </div>
);

const Home = ({ shoppingListItems, calendarEvents, onAddShoppingItem }) => {
    const { currentUser } = useUser();
    const [newShoppingItem, setNewShoppingItem] = useState('');

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-bold text-on-surface-variant">טוען...</p>
            </div>
        );
    }

    moment.locale('he'); // Set moment to use Hebrew

    const upcomingEvents = calendarEvents
        .filter(event => moment(event.start).isAfter(moment()))
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    
    const nextEvent = upcomingEvents[0];
    const uncompletedItems = shoppingListItems.filter(item => !item.completed);

    const handleQuickAddItem = () => {
        if (newShoppingItem.trim()) {
            onAddShoppingItem(newShoppingItem);
            setNewShoppingItem('');
        }
    };

    return (
        <div className="animate-fade-in-up p-4 md:p-6 lg:p-8">
            {/* --- Header Section --- */}
            <section className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">
                    ברוך שובך, <span className="text-primary">{currentUser.name.split(' ')[0]}</span>
                </h1>
                <p className="text-lg text-on-surface-variant mt-1">{moment().format('dddd, D MMMM')}</p>
            </section>

            {/* --- "Up Next" Event Highlight --- */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-on-surface mb-4">האירוע הבא שלכם</h2>
                {nextEvent ? (
                    <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4">
                        <span className="material-symbols-outlined text-4xl bg-primary/20 p-3 rounded-full">event</span>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold">{nextEvent.title}</h3>
                            <p className="opacity-80">{moment(nextEvent.start).calendar()} ({moment(nextEvent.start).fromNow()})</p>
                        </div>
                        <Link to="/calendar" className="bg-primary text-on-primary font-bold py-2 px-4 rounded-full self-end md:self-center">
                            ללוח השנה
                        </Link>
                    </div>
                ) : (
                    <EmptyState icon="event_available" text="אין אירועים קרובים. זמן לנוח!" />
                )}
            </section>

            {/* --- Dashboard Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Shopping List Card */}
                <div className="lg:col-span-1 bg-surface-container-low rounded-2xl p-6 flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">shopping_cart</span>
                        רשימת קניות
                    </h3>
                    {uncompletedItems.length > 0 ? (
                        uncompletedItems.slice(0, 4).map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-surface p-3 rounded-lg">
                                <div className="w-5 h-5 rounded border-2 border-outline/50"></div>
                                <span className="font-medium truncate">{item.text}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-on-surface-variant text-center py-4">הרשימה ריקה!</p>
                    )}
                    <div className="flex items-center gap-2 mt-auto">
                        <input 
                            type="text" 
                            value={newShoppingItem}
                            onChange={(e) => setNewShoppingItem(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleQuickAddItem()}
                            placeholder="הוספה מהירה..." 
                            className="flex-1 p-3 bg-surface-container-highest rounded-full border-0 focus:ring-2 focus:ring-secondary text-on-surface"
                        />
                        <button onClick={handleQuickAddItem} className="p-3 bg-secondary text-on-secondary rounded-full" disabled={!newShoppingItem.trim()}>
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>
                </div>

                {/* Gallery & Chat Combined Card */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Gallery Preview */}
                    <div className="bg-surface-container-low rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-tertiary">photo_library</span>
                            מה חדש בגלריה?
                        </h3>
                        {/* Placeholder for gallery images - replace with real data */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="aspect-square rounded-lg bg-surface-container hover:opacity-80 transition-opacity"><img src="https://images.unsplash.com/photo-1542037104843-0502011b66e8?w=200" className="w-full h-full object-cover rounded-lg"/></div>
                            <div className="aspect-square rounded-lg bg-surface-container hover:opacity-80 transition-opacity"><img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200" className="w-full h-full object-cover rounded-lg"/></div>
                            <div className="aspect-square rounded-lg bg-surface-container hover:opacity-80 transition-opacity"><img src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=200" className="w-full h-full object-cover rounded-lg"/></div>
                            <Link to="/gallery" className="aspect-square rounded-lg border-2 border-dashed border-outline/30 flex flex-col items-center justify-center text-tertiary hover:bg-tertiary-container/30">
                                <span className="material-symbols-outlined">arrow_forward</span>
                                <span>לכל התמונות</span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Chat Preview */}
                    <div className="bg-surface-container-low rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                             <span className="material-symbols-outlined text-primary">chat</span>
                            הודעות אחרונות
                        </h3>
                        {/* Placeholder for chat messages - replace with real data */}
                        <div className="space-y-3">
                            <div className="p-3 bg-surface rounded-lg text-sm"><strong className="text-primary-variant">אמא:</strong> אל תשכחו לקנות חלב!</div>
                            <div className="p-3 bg-surface rounded-lg text-sm"><strong className="text-primary-variant">אבא:</strong> בדרך, קונה עכשיו.</div>
                        </div>
                         <Link to="/chat" className="text-primary font-bold mt-4 inline-block">
                            פתח את הצ'אט המלא
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;