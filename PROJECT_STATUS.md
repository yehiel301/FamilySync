### **סקירת פרויקט FamilySync**

**מטרה:** פלטפורמה אחודה לניהול וסנכרון התא המשפחתי, הכוללת יומן, רשימת קניות, גלריית תמונות וניהול פרופילים.

**טכנולוגיות:**
*   **Frontend:** React (JavaScript), Vite, Tailwind CSS
*   **Backend:** Java, Spring Boot
*   **Database:** MongoDB

---

### **מיקומי קבצים מרכזיים**

*   **תיקיית הפרויקט הראשית:** `C:/Users/yehie/Desktop/backup/לימודים/פרויקט גמר/FamilySync/`
*   **קבצי Frontend (צד לקוח):** `C:/Users/yehie/Desktop/backup/לימודים/פרויקט גמר/FamilySync/src/`
*   **קבצי Backend (צד שרת):** `C:/Users/yehie/Desktop/backup/לימודים/פרויקט גמר/FamilySync/FamilySync-Backend/api/src/main/java/com/familysync/api/`

---

### **רשימת קבצים מלאה**

**Backend:**
*   `ApiApplication.java` (נקודת הכניסה לשרת)
*   **Controllers:**
    *   `AuthController.java` (הרשמה, התחברות, עדכון משתמש)
    *   `GalleryController.java` (ניהול גלריה)
    *   `ShoppingController.java` (ניהול רשימת קניות)
    *   `EventController.java` (ניהול אירועים)
    *   `FileController.java` (לוגיקה בסיסית של העלאת קבצים)
*   **Models:**
    *   `User.java`
    *   `Photo.java`
    *   `ShoppingItem.java`
    *   `Event.java`
    *   `FamilyMember.java`
*   **Repositories:**
    *   `UserRepository.java`
    *   `PhotoRepository.java`
    *   `ShoppingItemRepository.java`
    *   `EventRepository.java`
*   **Configuration:**
    *   `WebConfig.java` (הגדרות CORS ו-Resources)

**Frontend:**
*   `App.jsx` (רכיב ראשי, ניהול מצב גלובלי ו-Routing)
*   `main.jsx` (נקודת כניסה ל-React)
*   `UserContext.jsx` (ניהול מצב המשתמש המחובר)
*   **Components:**
    *   `Home.jsx`
    *   `Login.jsx` / `Register.jsx`
    *   `UserProfile.jsx`
    *   `PhotoGallery.jsx`
    *   `ShoppingList.jsx`
    *   `Calendar.jsx`
    *   `ProtectedRoute.jsx`

---

## מה בוצע עד כה (הישגים מרכזיים):

### Backend (שרת):
- **ניהול משתמשים:**
  - API מלא להרשמה (`/register`) והתחברות (`/login`).
  - **שיוך משפחה אוטומטי:** תהליך ההרשמה יוצר `familyId` ייחודי לכל משתמש חדש.
  - API לעדכון פרטי משתמש (`PUT /users/{id}`), כולל אפשרות למחיקת תמונת פרופיל (עדכון ל-`null`).
- **גלריית תמונות (מערכת מלאה):**
  - `GalleryController` ייעודי עם API מלא לניהול הגלריה (העלאה, שליפה לפי `familyId`, מחיקה).
  - מודל `Photo` ו-`PhotoRepository` לניהול המידע ב-MongoDB.
  - שמירת קבצים פיזיים בתיקיית `uploads` בשרת.
- **רשימת קניות (מערכת מלאה):**
  - **שויכה למשפחה:** המודל `ShoppingItem` וה-API עודכנו כך שכל פריט משויך ל-`familyId`.
  - ה-API תומך בשליפה ויצירה של פריטים פר-משפחה.
- **יומן משפחתי:**
  - `EventController` עם API מלא (CRUD), כולל יכולת שליפה לפי `familyId`.

### Frontend (אפליקציית רשת):
- **ארכיטקטורה:**
  - אפליקציית דף יחיד (SPA) מבוססת React.
  - ניהול מצב גלובלי מרכזי ב-`App.jsx` עבור רשימת הקניות והיומן.
  - שימוש ב-`UserContext` לניהול פרטי המשתמש המחובר בכל האפליקציה.
- **פיצ'רים:**
  - **פרופיל משתמש:**
    - הצגת פרטי משתמש.
    - העלאה, צילום ומחיקה של תמונת פרופיל.
    - כפתורי הפעולה נמצאים כעת מתחת לתמונה לנוחות שימוש.
  - **גלריית תמונות:**
    - מחוברת במלואה ל-API.
    - **חווית משתמש משופרת:** אפקט הגדלה בריחוף, פתיחת תמונה במסך מלא (Lightbox) בלחיצה, וכפתור מחיקה גלוי תמיד.
  - **רשימת קניות:**
    - מחוברת במלואה ל-API המשודרג, ומציגה נתונים לפי המשפחה של המשתמש.
  - **יומן משפחתי:**
    - **סנכרון מלא בצד הלקוח:** הוספת אירוע בלוח השנה מעדכנת אוטומטית את התצוגה בדף הבית.

---

## מה נשאר לעשות (צעדים מומלצים):

1.  **ניהול חברי משפחה בפרופיל:**
    *   **מטרה:** לאפשר למנהל המשפחה להוסיף, לערוך ולהסיר בני משפחה מעמוד הפרופיל.
    *   **שלבים:**
        1.  יצירת API להזמנת משתמשים אחרים למשפחה (למשל, באמצעות אימייל).
        2.  יצירת API לעדכון רשימת `familyMembers` של המשתמש.
        3.  חיבור כפתורי ה"הוסף", "ערוך" ו"מחק" בעמוד הפרופיל ל-API החדש.

2.  **פיצ'רים מתקדמים (אופציונלי):**
    *   **צ'אט משפחתי:** בניית תשתית WebSockets ב-Backend וחיבורה לקומפוננטת הצ'אט.
    *   **התראות (Notifications):** הוספת מערכת התראות.
    *   **פריסה לענן (Deployment):** העלאת הפרויקט לשירותי ענן.