import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useUser } from '../UserContext';

const UserProfile = () => {
    const { currentUser, saveUser } = useUser();
    const [profileImage, setProfileImage] = useState(currentUser?.profileImageUrl ? `http://localhost:8080${currentUser.profileImageUrl}` : '/default_avatar.png');
    const [userName, setUserName] = useState(currentUser?.name || 'משתמש לא ידוע');
    const [familyMembers, setFamilyMembers] = useState([]);
    const [copySuccess, setCopySuccess] = useState('');

    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (currentUser) {
            setUserName(currentUser.name);
            setProfileImage(currentUser.profileImageUrl ? `http://localhost:8080${currentUser.profileImageUrl}` : '/default_avatar.png');
            
            // Fetch all family members
            const fetchFamilyMembers = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/auth/family/${currentUser.familyId}`);
                    if (response.ok) {
                        const members = await response.json();
                        // Filter out the current user from the list
                        setFamilyMembers(members.filter(member => member.id !== currentUser.id));
                    }
                } catch (error) {
                    console.error('Failed to fetch family members:', error);
                }
            };

            fetchFamilyMembers();
        }
    }, [currentUser]);

    const handleCopyCode = () => {
        if (currentUser?.familyCode) {
            navigator.clipboard.writeText(currentUser.familyCode).then(() => {
                setCopySuccess('הקוד הועתק!');
                setTimeout(() => setCopySuccess(''), 2000);
            }, (err) => {
                setCopySuccess('נכשל בהעתקה');
                setTimeout(() => setCopySuccess(''), 2000);
            });
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק את חבר המשפחה הזה?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/auth/users/${memberId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the member from the local state
                setFamilyMembers(familyMembers.filter(member => member.id !== memberId));
                alert('חבר המשפחה נמחק בהצלחה.');
            } else {
                throw new Error('Failed to delete family member');
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('שגיאה במחיקת חבר המשפחה.');
        }
    };

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    const uploadImageToServer = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadResponse = await fetch('http://localhost:8080/api/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) throw new Error('Failed to upload image');
            const imageUrl = await uploadResponse.text();

            if (currentUser) {
                const updateResponse = await fetch(`http://localhost:8080/api/auth/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profileImageUrl: imageUrl })
                });

                if (!updateResponse.ok) throw new Error('Failed to update user profile');
                const updatedUser = await updateResponse.json();
                
                saveUser(updatedUser);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('שגיאה בהעלאת התמונה. נסה שוב.');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            uploadImageToServer(e.target.files[0]);
        }
    };

    const handleTakePhotoClick = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
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
            const file = dataURLtoFile(canvasRef.current.toDataURL('image/png'), 'camera-capture.png');
            uploadImageToServer(file);
            handleCloseCamera();
        }
    };

    const handleCloseCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const handleDeleteImage = async () => {
        if (!currentUser) return;
        if (!window.confirm('האם אתה בטוח שברצונך למחוק את תמונת הפרופיל?')) return;

        try {
            const updateResponse = await fetch(`http://localhost:8080/api/auth/users/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileImageUrl: null })
            });

            if (!updateResponse.ok) throw new Error('Failed to delete user profile image');
            
            const updatedUser = await updateResponse.json();
            
            saveUser(updatedUser);
            setProfileImage('/default_avatar.png');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('שגיאה במחיקת התמונה.');
        }
    };

    return (
        <section className="flex-1 px-4 md:px-12 max-w-6xl mx-auto w-full animate-fade-in-up">
            {/* User Profile Header Section */}
            <div className="mt-8 mb-12 flex flex-col md:flex-row items-center md:items-end gap-8 relative">
                {/* Image and Action Buttons */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden ring-8 ring-surface-container-low shadow-lg">
                        <img className="w-full h-full object-cover" src={profileImage} alt="Profile" />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <button onClick={() => document.getElementById('upload-button').click()} className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full shadow-sm hover:bg-secondary-container/80 transition-colors text-sm font-bold" title="העלה קובץ">
                            <span className="material-symbols-outlined text-base">upload_file</span>
                            העלה
                        </button>
                        <button onClick={handleTakePhotoClick} className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface-variant rounded-full shadow-sm hover:bg-surface-container-high transition-colors text-sm font-bold" title="צלם תמונה">
                            <span className="material-symbols-outlined text-base">photo_camera</span>
                            צלם
                        </button>
                        {currentUser?.profileImageUrl && (
                            <button onClick={handleDeleteImage} className="p-2 bg-error-container text-on-error-container rounded-full shadow-sm hover:bg-error-container/80 transition-colors" title="מחק תמונה">
                                <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                        )}
                    </div>
                    <Form.Control type="file" id="upload-button" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
                </div>

                <div className="text-center md:text-right flex-1">
                    <span className="px-4 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-sm font-semibold mb-3 inline-block">מנהל/ת המשפחה</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-on-background tracking-tight mb-2">{userName}</h1>
                    <p className="text-on-surface-variant font-medium flex items-center justify-center md:justify-start gap-2">
                        <span className="material-symbols-outlined text-sm">mail</span> {currentUser?.email}
                    </p>
                </div>
            </div>

            {/* Family Code Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-on-background mb-4 text-center md:text-right">הצטרפות למשפחה</h2>
                <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-right">
                        <h3 className="font-bold text-on-background text-lg">שתפו את הקוד המשפחתי</h3>
                        <p className="text-on-surface-variant text-sm">כדי לצרף בני משפחה, שלחו להם את הקוד הזה. הם יצטרכו להזין אותו בעת ההרשמה.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-surface-container-high p-3 rounded-xl">
                        <span className="text-2xl font-mono font-bold text-primary tracking-widest">{currentUser?.familyCode || '...'}</span>
                        <button onClick={handleCopyCode} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-sm">
                            <span className="material-symbols-outlined text-base">{copySuccess ? 'check' : 'content_copy'}</span>
                            {copySuccess ? 'הועתק' : 'העתק'}
                        </button>
                    </div>
                </div>
            </div>


            {/* Family Management Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
                <div className="md:col-span-12 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-on-background">המעגל המשפחתי</h2>
                    <button className="flex items-center gap-2 text-primary font-bold px-4 py-2 hover:bg-surface-container-low rounded-full transition-colors">
                        <span className="material-symbols-outlined">group_add</span>
                        הוסף חבר/ה
                    </button>
                </div>
                
                {familyMembers.map((member, index) => (
                    <div key={member.id || index} className="md:col-span-4 bg-surface-container-low p-6 rounded-xl relative group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-4 ring-white bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-2xl">
                                {member.profileImageUrl ? (
                                    <img src={`http://localhost:8080${member.profileImageUrl}`} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    member.name.charAt(0)
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-on-background">{member.name}</h3>
                            <p className="text-on-surface-variant font-medium mb-4">{member.email}</p>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 rounded-full bg-white/50 text-on-surface-variant hover:bg-white hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button onClick={() => handleDeleteMember(member.id)} className="p-2 rounded-full bg-white/50 text-on-surface-variant hover:bg-white hover:text-error transition-all">
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Account Safety Section */}
            <div className="mb-24">
                <h2 className="text-2xl font-bold text-on-background mb-6">אבטחת חשבון</h2>
                <div className="bg-surface-container-low rounded-xl overflow-hidden">
                    <div className="p-6 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined">lock_reset</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-on-background">סיסמה ואבטחה</h4>
                                <p className="text-sm text-on-surface-variant">עודכן לאחרונה לפני 3 חודשים</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-outline">chevron_right</span>
                    </div>
                </div>
            </div>

            <Modal show={showCamera} onHide={handleCloseCamera} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>צלם תמונת פרופיל</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <video ref={videoRef} autoPlay playsInline className="w-100 rounded-xl"></video>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleCloseCamera} className="px-4 py-2 rounded-full font-bold text-on-surface-variant hover:bg-surface-variant">ביטול</button>
                    <button onClick={handleCapture} className="px-6 py-2 rounded-full font-bold bg-primary text-on-primary border-0 hover:bg-primary-dim flex items-center gap-2">
                        <span className="material-symbols-outlined">photo_camera</span>
                        צלם
                    </button>
                </Modal.Footer>
            </Modal>
        </section>
    );
};

export default UserProfile;