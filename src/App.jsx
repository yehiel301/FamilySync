import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import './App.css';
import React from 'react';
import moment from 'moment';

import Home from './components/Home';
import Calendar from './components/Calendar';
import ShoppingList from './components/ShoppingList';
import UserProfile from './components/UserProfile';
import Chat from './components/Chat';
import PhotoGallery from './components/PhotoGallery';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider, useUser } from './UserContext';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const { currentUser, removeUser } = useUser();

    const handleLogout = () => {
        removeUser();
    };

    return (
        <div className="flex max-w-[1600px] mx-auto relative">
            <header className="bg-[#fff8f6] dark:bg-stone-950 text-orange-900 dark:text-orange-200 flex justify-between items-center px-6 py-4 w-full fixed top-0 z-40 md:hidden shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#9b4600] dark:text-[#ffae80] font-headline">FamilySync</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleLogout} className="text-sm font-bold text-primary">התנתק</button>
                    <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full">
                         <img alt="User profile" className="w-8 h-8 rounded-full object-cover" src={currentUser?.profileImageUrl ? `http://localhost:8080${currentUser.profileImageUrl}` : "/default_avatar.png"} />
                    </div>
                </div>
            </header>

            <aside className="hidden md:flex flex-col h-screen py-8 gap-2 bg-[#fff1ed] dark:bg-stone-900 text-orange-900 dark:text-orange-200 w-64 sticky top-0 border-r border-outline-variant/30 z-50">
                <div className="px-8 mb-8 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary-container rounded-3xl flex items-center justify-center mb-4 shadow-sm overflow-hidden">
                        <img alt="User profile" className="w-full h-full object-cover" src={currentUser?.profileImageUrl ? `http://localhost:8080${currentUser.profileImageUrl}` : "/default_avatar.png"} />
                    </div>
                    <h2 className="text-xl font-black text-[#9b4600] font-headline">{currentUser?.name}</h2>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                         משפחת {currentUser?.familyName ? currentUser.familyName : 'שלי'}
                    </p>
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    <NavLink to="/" className={({isActive}) => `mx-4 px-4 py-3 flex items-center gap-3 rounded-full transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600] font-bold shadow-sm' : 'text-orange-800 hover:bg-[#ffdbd0]/50'}`} end>
                        <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/' ? "'FILL' 1" : "'FILL' 0"}}>home</span>
                        <span>ראשי</span>
                    </NavLink>
                    <NavLink to="/calendar" className={({isActive}) => `mx-4 px-4 py-3 flex items-center gap-3 rounded-full transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600] font-bold shadow-sm' : 'text-orange-800 hover:bg-[#ffdbd0]/50'}`}>
                        <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/calendar' ? "'FILL' 1" : "'FILL' 0"}}>calendar_month</span>
                        <span>יומן</span>
                    </NavLink>
                    <NavLink to="/shopping-list" className={({isActive}) => `mx-4 px-4 py-3 flex items-center gap-3 rounded-full transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600] font-bold shadow-sm' : 'text-orange-800 hover:bg-[#ffdbd0]/50'}`}>
                        <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/shopping-list' ? "'FILL' 1" : "'FILL' 0"}}>shopping_basket</span>
                        <span>קניות</span>
                    </NavLink>
                    <NavLink to="/gallery" className={({isActive}) => `mx-4 px-4 py-3 flex items-center gap-3 rounded-full transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600] font-bold shadow-sm' : 'text-orange-800 hover:bg-[#ffdbd0]/50'}`}>
                        <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/gallery' ? "'FILL' 1" : "'FILL' 0"}}>photo_library</span>
                        <span>גלריה</span>
                    </NavLink>
                    <NavLink to="/chat" className={({isActive}) => `mx-4 px-4 py-3 flex items-center gap-3 rounded-full transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600] font-bold shadow-sm' : 'text-orange-800 hover:bg-[#ffdbd0]/50'}`}>
                        <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/chat' ? "'FILL' 1" : "'FILL' 0"}}>chat</span>
                        <span>צ'אט</span>
                    </NavLink>
                    <NavLink to="/user-profile" className={({isActive}) => `mx-4 px-4 py-3 flex items-center gap-3 rounded-full transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600] font-bold shadow-sm' : 'text-orange-800 hover:bg-[#ffdbd0]/50'}`}>
                        <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/user-profile' ? "'FILL' 1" : "'FILL' 0"}}>person</span>
                        <span>פרופיל</span>
                    </NavLink>
                </nav>
                <div className="px-4 mb-4 mt-auto">
                    <button onClick={handleLogout} className="w-full py-3 flex items-center justify-center gap-2 text-error font-bold rounded-full hover:bg-error-container/20 transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                        התנתק
                    </button>
                </div>
            </aside>

            <main className="flex-1 w-full pb-24 md:pb-8 pt-[80px] md:pt-0 min-h-screen relative">
                {children}
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-2 bg-[#fff8f6]/90 backdrop-blur-xl shadow-[0_-12px_40px_0_rgba(79,39,26,0.06)] border-t border-outline-variant/20">
                <NavLink to="/" className={({isActive}) => `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600]' : 'text-orange-800'}`} end>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/' ? "'FILL' 1" : "'FILL' 0"}}>home</span>
                    <span className="font-body text-[10px] font-semibold mt-1">ראשי</span>
                </NavLink>
                <NavLink to="/calendar" className={({isActive}) => `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600]' : 'text-orange-800'}`}>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/calendar' ? "'FILL' 1" : "'FILL' 0"}}>calendar_today</span>
                    <span className="font-body text-[10px] font-semibold mt-1">יומן</span>
                </NavLink>
                <NavLink to="/shopping-list" className={({isActive}) => `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600]' : 'text-orange-800'}`}>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/shopping-list' ? "'FILL' 1" : "'FILL' 0"}}>shopping_cart</span>
                    <span className="font-body text-[10px] font-semibold mt-1">קניות</span>
                </NavLink>
                <NavLink to="/gallery" className={({isActive}) => `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600]' : 'text-orange-800'}`}>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/gallery' ? "'FILL' 1" : "'FILL' 0"}}>image</span>
                    <span className="font-body text-[10px] font-semibold mt-1">גלריה</span>
                </NavLink>
                <NavLink to="/chat" className={({isActive}) => `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600]' : 'text-orange-800'}`}>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/chat' ? "'FILL' 1" : "'FILL' 0"}}>chat</span>
                    <span className="font-body text-[10px] font-semibold mt-1">צ'אט</span>
                </NavLink>
                 <NavLink to="/user-profile" className={({isActive}) => `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? 'bg-[#ffdbd0] text-[#9b4600]' : 'text-orange-800'}`}>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/user-profile' ? "'FILL' 1" : "'FILL' 0"}}>person</span>
                    <span className="font-body text-[10px] font-semibold mt-1">פרופיל</span>
                </NavLink>
            </nav>
        </div>
    );
};

const AppContent = () => {
    const { currentUser } = useUser();
    const [shoppingItems, setShoppingItems] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        if (currentUser?.familyId) {
            fetch(`http://localhost:8080/api/shopping/${currentUser.familyId}`)
                .then(response => response.json())
                .then(data => setShoppingItems(data))
                .catch(error => console.error('Error fetching shopping items:', error));
        } else {
            setShoppingItems([]);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser?.familyId) {
            fetch(`http://localhost:8080/events/${currentUser.familyId}`)
                .then(response => response.ok ? response.json() : [])
                .then(data => setCalendarEvents(data))
                .catch(error => {
                    console.error('Error fetching calendar events:', error);
                    setCalendarEvents([]);
                });
        } else {
            setCalendarEvents([]);
        }
    }, [currentUser]);

    const handleAddShoppingItem = (newItemText) => {
        if (!newItemText.trim() || !currentUser?.familyId) return;
        const newItem = { text: newItemText.trim(), completed: false, familyId: currentUser.familyId };
        fetch('http://localhost:8080/api/shopping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem),
        })
        .then(response => response.json())
        .then(savedItem => setShoppingItems(prev => [...prev, savedItem]))
        .catch(error => console.error('Error adding item:', error));
    };

    const handleToggleShoppingItem = (id) => {
        const item = shoppingItems.find(i => i.id === id);
        if (!item) return;
        const updatedItem = { ...item, completed: !item.completed };
        fetch(`http://localhost:8080/api/shopping/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: updatedItem.completed }),
        })
        .then(response => {
            if (response.ok) {
                setShoppingItems(prev => prev.map(i => i.id === id ? updatedItem : i));
            }
        })
        .catch(error => console.error('Error updating item:', error));
    };

    const handleDeleteShoppingItem = (id) => {
        fetch(`http://localhost:8080/api/shopping/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) setShoppingItems(prev => prev.filter(i => i.id !== id));
        })
        .catch(error => console.error('Error deleting item:', error));
    };

    const handleAddCalendarEvent = (newEvent) => {
        if (!currentUser?.familyId) return;
        const eventWithFamilyId = { ...newEvent, familyId: currentUser.familyId };
        fetch('http://localhost:8080/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventWithFamilyId),
        })
        .then(response => response.json())
        .then(savedEvent => setCalendarEvents(prev => [...prev, savedEvent]))
        .catch(error => console.error('Error adding event:', error));
    };

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/*" element={
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<Home shoppingListItems={shoppingItems} calendarEvents={calendarEvents} onAddShoppingItem={handleAddShoppingItem} />} />
                            <Route path="/calendar" element={<Calendar events={calendarEvents} onAddEvent={handleAddCalendarEvent} />} />
                            <Route path="/shopping-list" element={<ShoppingList shoppingItems={shoppingItems} onAddItem={handleAddShoppingItem} onToggleComplete={handleToggleShoppingItem} onDeleteItem={handleDeleteShoppingItem} />} />
                            <Route path="/gallery" element={<PhotoGallery />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/user-profile" element={<UserProfile />} />
                        </Routes>
                    </MainLayout>
                } />
            </Route>
        </Routes>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </BrowserRouter>
    );
};

export default App;