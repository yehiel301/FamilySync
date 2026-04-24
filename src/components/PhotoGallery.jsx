import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useUser } from '../UserContext';
import './PhotoGallery.css';

const PhotoGallery = () => {
    const { currentUser } = useUser();
    const [photos, setPhotos] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showCamera, setShowCamera] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null); // For lightbox
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const fetchPhotos = async () => {
        if (!currentUser?.familyId) return;
        try {
            const response = await fetch(`http://localhost:8080/api/gallery/${currentUser.familyId}`);
            if (!response.ok) throw new Error('Failed to fetch photos');
            const data = await response.json();
            const photosWithFullUrl = data.map(photo => ({
                ...photo,
                src: `http://localhost:8080${photo.url}`
            })).sort((a, b) => new Date(b.date) - new Date(a.date));
            setPhotos(photosWithFullUrl);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    useEffect(() => {
        if (currentUser?.familyId) {
            fetchPhotos();
        }
    }, [currentUser]);

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    const addPhoto = async (file) => {
        if (!currentUser?.familyId) {
            alert("אינך משוייך למשפחה. לא ניתן להעלות תמונות.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('familyId', currentUser.familyId);
        formData.append('title', 'תמונה חדשה');

        try {
            const response = await fetch('http://localhost:8080/api/gallery/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload photo');
            
            fetchPhotos();

        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('שגיאה בהעלאת התמונה.');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            addPhoto(e.target.files[0]);
        }
    };

    const handleTakePhotoClick = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert("לא ניתן לגשת למצלמה. אנא ודא שהענקת הרשאה.");
            setShowCamera(false);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            const video = videoRef.current;
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            const file = dataURLtoFile(canvasRef.current.toDataURL('image/png'), 'camera-shot.png');
            addPhoto(file);
            handleCloseCamera();
        }
    };

    const handleCloseCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const handleDeletePhoto = async (idToDelete) => {
        if(window.confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/gallery/${idToDelete}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Failed to delete photo');

                setPhotos(photos.filter(photo => photo.id !== idToDelete));

            } catch (error) {
                console.error('Error deleting photo:', error);
                alert('שגיאה במחיקת התמונה.');
            }
        }
    };

    return (
        <div className="animate-fade-in-up px-4 md:px-8 max-w-7xl mx-auto pt-4">
            
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="max-w-xl text-right w-full">
                    <h3 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background tracking-tight mb-2">
                        הזיכרונות <span className="text-primary">שלנו</span>
                    </h3>
                    <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
                        האלבום המשפחתי המשותף. כל הרגעים הקטנים והגדולים במקום אחד.
                    </p>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleTakePhotoClick}
                        className="flex-1 md:flex-none group relative flex items-center justify-center gap-2 bg-surface-container-high text-primary font-bold px-6 py-4 rounded-xl shadow-sm hover:bg-surface-container-highest transition-colors"
                    >
                        <span className="material-symbols-outlined" data-icon="photo_camera">photo_camera</span>
                        <span className="font-label uppercase tracking-widest text-xs hidden sm:inline">צלם</span>
                    </button>
                    
                    <button 
                        onClick={() => document.getElementById('upload-photo-input').click()}
                        className="flex-1 md:flex-none group relative flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-4 rounded-xl shadow-lg hover:scale-[0.98] transition-transform"
                    >
                        <span className="material-symbols-outlined" data-icon="upload">upload</span>
                        <span className="font-label uppercase tracking-widest text-xs">העלה תמונה</span>
                    </button>
                    <input 
                        type="file" 
                        id="upload-photo-input" 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar dir-ltr" dir="ltr">
                <button className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${filter === 'All' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container-high'}`} onClick={() => setFilter('All')}>הכל</button>
                <button className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${filter === 'Recent' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container-high'}`} onClick={() => setFilter('Recent')}>נוספו לאחרונה</button>
                <button className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${filter === 'Favorites' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container-high'}`} onClick={() => setFilter('Favorites')}>מועדפים</button>
            </div>

            {/* Masonry Grid */}
            <div className="masonry-grid mt-4">
                {photos.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-on-surface-variant opacity-60 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/30">
                        <span className="material-symbols-outlined text-6xl mb-4">photo_library</span>
                        <p className="text-xl font-bold font-headline">הגלריה ריקה</p>
                        <p>העלו את התמונה הראשונה של המשפחה!</p>
                    </div>
                ) : (
                    photos.map((photo) => (
                        <div key={photo.id} className="relative group bg-surface-container p-2 rounded-2xl shadow-sm">
                            <div className="overflow-hidden rounded-xl cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                                <img 
                                    src={photo.src} 
                                    alt={photo.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                            </div>
                            <div className="flex justify-between items-center pt-3 px-2">
                                <div>
                                    <p className="font-bold text-on-surface text-sm">{photo.title}</p>
                                    <p className="text-xs text-on-surface-variant">{new Date(photo.date).toLocaleDateString('he-IL')}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center hover:bg-error hover:text-on-error transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Lightbox Modal for selected photo */}
            <Modal show={selectedPhoto !== null} onHide={() => setSelectedPhoto(null)} size="xl" centered>
                <Modal.Body className="p-0">
                    {selectedPhoto && (
                        <img src={selectedPhoto.src} alt={selectedPhoto.title} className="w-full h-auto object-contain rounded-lg" />
                    )}
                </Modal.Body>
            </Modal>

            {/* Camera Modal */}
            <Modal show={showCamera} onHide={handleCloseCamera} size="lg" centered dir="rtl">
                <Modal.Header closeButton className="border-b-0 pb-0">
                    <Modal.Title className="font-headline font-bold text-2xl">צלם תמונה לגלריה</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <div className="rounded-2xl overflow-hidden bg-black">
                        <video ref={videoRef} autoPlay playsInline className="w-full"></video>
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-t-0 pt-0 flex justify-between">
                    <button onClick={handleCloseCamera} className="px-6 py-2 rounded-full font-bold text-on-surface-variant hover:bg-surface-variant transition-colors">
                        ביטול
                    </button>
                    <button onClick={handleCapture} className="px-8 py-3 rounded-full font-bold bg-primary text-on-primary border-0 hover:bg-primary-dim flex items-center gap-2 shadow-md hover:scale-105 transition-all">
                        <span className="material-symbols-outlined">photo_camera</span>
                        צלם ושמור
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PhotoGallery;