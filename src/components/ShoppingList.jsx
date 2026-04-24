import React, { useState } from 'react';
import './ShoppingList.css';

const ShoppingList = ({ shoppingItems, onAddItem, onToggleComplete, onDeleteItem, onMoveItem }) => {
    const [newItemText, setNewItemText] = useState('');

    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItemText.trim() === '') return;
        onAddItem(newItemText);
        setNewItemText('');
    };

    const pendingCount = shoppingItems.filter(item => !item.completed).length;

    return (
        <div className="animate-fade-in-up px-4 md:px-8 max-w-7xl mx-auto pt-4">
            
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h2 className="font-headline font-bold text-3xl text-[#9b4600] dark:text-[#ffae80]">רשימת קניות</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-1">מרכזים קניות לשבוע הקרוב</p>
                </div>
            </header>

            <section>
                {/* Add Item Area */}
                <div className="mb-10 relative group">
                    <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 relative z-10">
                        <form onSubmit={handleAddItem} className="flex flex-col gap-4">
                            <label className="text-sm font-bold text-primary uppercase tracking-wider px-2 font-label">הוסף פריט חדש לרשימה</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="text"
                                    required
                                    value={newItemText}
                                    onChange={(e) => setNewItemText(e.target.value)}
                                    className="flex-1 bg-white border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-shadow shadow-sm outline-none text-lg" 
                                    placeholder="לדוגמא: חלב שיבולת שועל, עגבניות..." 
                                />
                                <button 
                                    type="submit"
                                    disabled={!newItemText.trim()}
                                    className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:bg-primary-dim"
                                >
                                    <span className="material-symbols-outlined font-bold">add</span>
                                    <span className="text-lg">הוסף</span>
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Ambient Glow */}
                    <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full bg-primary-container/20 blur-2xl rounded-[2rem]"></div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Grocery List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2 mb-6">
                            <h3 className="font-headline text-2xl font-bold text-on-background">המוצרים שלנו</h3>
                            <span className="text-sm font-bold bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-full shadow-sm">
                                {pendingCount} נותרו
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {shoppingItems.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className={`group flex items-center justify-between p-4 md:p-5 rounded-2xl transition-all ${
                                        item.completed 
                                        ? 'bg-surface-container-low opacity-60 border-r-4 border-transparent' 
                                        : 'bg-white shadow-sm hover:shadow-md border-r-4 border-primary'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => onToggleComplete(item.id)}>
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                                            item.completed 
                                            ? 'bg-tertiary border-tertiary text-on-tertiary' 
                                            : 'border-outline-variant hover:border-primary text-transparent'
                                        }`}>
                                            <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: item.completed ? "'FILL' 1" : "'FILL' 0"}}>check</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`font-bold text-lg truncate ${item.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex items-center gap-1 md:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity shrink-0" dir="ltr">
                                        <div className="flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/20">
                                            <button 
                                                onClick={() => onMoveItem(item.id, 'up')} 
                                                disabled={index === 0} 
                                                className="text-on-surface-variant hover:text-primary hover:bg-primary-container/20 disabled:opacity-30 disabled:hover:bg-transparent p-1 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg leading-none block">keyboard_arrow_up</span>
                                            </button>
                                            <div className="h-px w-full bg-outline-variant/20"></div>
                                            <button 
                                                onClick={() => onMoveItem(item.id, 'down')} 
                                                disabled={index === shoppingItems.length - 1} 
                                                className="text-on-surface-variant hover:text-primary hover:bg-primary-container/20 disabled:opacity-30 disabled:hover:bg-transparent p-1 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg leading-none block">keyboard_arrow_down</span>
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => onDeleteItem(item.id)} 
                                            className="w-10 h-10 ml-2 md:ml-4 text-error hover:bg-error-container hover:text-on-error-container rounded-full transition-colors flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {shoppingItems.length === 0 && (
                                <div className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-outline-variant/40">
                                    <div className="w-20 h-20 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-4xl text-primary opacity-60">shopping_basket</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-on-background mb-2 font-headline">העגלה ריקה!</h3>
                                    <p className="text-on-surface-variant font-medium">הוסיפו פריטים כדי שכולם ידעו מה חסר בבית.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side Panel (Categories / Inspiration) */}
                    <div className="space-y-6 hidden lg:block">
                        <div className="bg-surface-container p-8 rounded-3xl shadow-sm border border-outline-variant/10">
                            <h3 className="font-headline font-bold text-primary mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined">category</span>
                                מחלקות נפוצות
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-4 py-2.5 bg-white rounded-full text-sm font-bold border-2 border-primary/30 text-primary shadow-sm">פירות וירקות</span>
                                <span className="px-4 py-2.5 bg-white/60 rounded-full text-sm font-bold border-2 border-transparent text-on-surface hover:bg-white transition-colors cursor-pointer">מוצרי חלב</span>
                                <span className="px-4 py-2.5 bg-white/60 rounded-full text-sm font-bold border-2 border-transparent text-on-surface hover:bg-white transition-colors cursor-pointer">מאפייה</span>
                                <span className="px-4 py-2.5 bg-white/60 rounded-full text-sm font-bold border-2 border-transparent text-on-surface hover:bg-white transition-colors cursor-pointer">קפואים</span>
                                <span className="px-4 py-2.5 bg-white/60 rounded-full text-sm font-bold border-2 border-transparent text-on-surface hover:bg-white transition-colors cursor-pointer">חטיפים וממתקים</span>
                            </div>
                        </div>

                        <div 
                            className="relative overflow-hidden rounded-3xl h-56 group cursor-pointer shadow-md" 
                            onClick={() => { setNewItemText('מצרכים לפסטה'); document.querySelector('form input').focus(); }}
                        >
                            <img alt="Fresh ingredients" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-on-background/90 via-on-background/40 to-transparent flex flex-col justify-end p-6">
                                <p className="text-primary-container text-xs font-bold uppercase tracking-widest mb-1">השראה לארוחת ערב</p>
                                <h4 className="text-white font-headline text-2xl font-bold">ערב פסטה איטלקי</h4>
                                <button className="mt-3 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 w-fit hover:bg-white/30 transition-colors">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    הוסף מצרכים
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShoppingList;