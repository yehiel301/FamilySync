import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getUser } from '../auth'; // Import getUser
import './Calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = () => { // Removed props
    const [events, setEvents] = useState([]); // Manage events in state
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState(null);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    // Fetch events from the server
    useEffect(() => {
        const fetchEvents = async () => {
            const user = getUser();
            if (!user || !user.familyId) return;

            try {
                const response = await fetch(`http://localhost:8080/events/${user.familyId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Convert date strings to Date objects
                    const formattedEvents = data.map(event => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end),
                    }));
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };

        fetchEvents();
    }, []);

    const handleNavigate = (newDate) => setDate(newDate);
    const handleView = (newView) => setView(newView);

    const handleShowModal = () => {
        setNewEvent({
            title: '',
            start: moment().startOf('day').toDate(),
            end: moment().endOf('day').toDate(),
            allDay: false,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewEvent(null);
    };

    // Save new event to the server
    const handleSaveEvent = async () => {
        const user = getUser();
        if (!newEvent || !user) return;

        const eventToSave = {
            ...newEvent,
            familyId: user.familyId,
            createdBy: user._id,
        };

        try {
            const response = await fetch('http://localhost:8080/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventToSave),
            });

            if (response.ok) {
                const savedEvent = await response.json();
                // Add the new event to the local state
                setEvents([...events, {
                    ...savedEvent,
                    start: new Date(savedEvent.start),
                    end: new Date(savedEvent.end),
                }]);
                handleCloseModal();
            }
        } catch (error) {
            console.error("Failed to save event:", error);
        }
    };
    
    const handleSelectEvent = (event) => {
        alert(`בחרת באירוע: ${event.title}`);
    };

    const eventPropGetter = (event, start, end, isSelected) => {
        let newStyle = {
            backgroundColor: "#ffae80", // primary-fixed
            color: '#451c00', // on-primary-fixed
            borderRadius: "8px",
            border: "none",
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'block',
            padding: '2px 4px'
        };

        if (event.title.toLowerCase().includes('רופא')) {
            newStyle.backgroundColor = "#c2e8ff"; // secondary-fixed
            newStyle.color = "#00455d";
        } else if (event.title.toLowerCase().includes('כדורגל')) {
            newStyle.backgroundColor = "#c1fd7c"; // tertiary-fixed
            newStyle.color = "#2c4d00";
        }

        return {
            className: "",
            style: newStyle
        };
    };

    return (
        <div className="animate-fade-in-up px-4 md:px-8 max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            {/* Calendar Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-on-background tracking-tight mb-1">
                        {moment(date).format('MMMM YYYY')}
                    </h1>
                    <p className="text-on-surface-variant font-medium">זמן משפחה איכותי!</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleShowModal}
                        className="bg-primary text-on-primary px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-primary-dim transition-colors shadow-sm ml-4"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span className="hidden sm:inline">הוסף אירוע</span>
                    </button>
                </div>
            </div>
            
            {/* Calendar Bento-Style Shell */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm flex-1 p-2 md:p-4">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    date={date}
                    view={view}
                    onNavigate={handleNavigate}
                    onView={handleView}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventPropGetter}
                    style={{ height: '100%', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                    messages={{
                        next: "הבא",
                        previous: "הקודם",
                        today: "היום",
                        month: "חודש",
                        week: "שבוע",
                        day: "יום",
                        agenda: "אג'נדה",
                        date: "תאריך",
                        time: "שעה",
                        event: "אירוע",
                        showMore: total => `+${total} נוספים`,
                        noEventsInRange: "אין אירועים בטווח זה."
                    }}
                />
            </div>

            {newEvent && (
                <Modal show={showModal} onHide={handleCloseModal} centered dir="rtl">
                    <Modal.Header closeButton className="border-b-0 pb-0">
                        <Modal.Title className="font-headline font-bold text-2xl">הוסף אירוע חדש</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-2">
                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label className="font-label text-sm font-bold text-on-surface-variant">מה האירוע?</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="לדוגמא: אסיפת הורים"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="bg-surface-container-low border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-fixed"
                                />
                            </Form.Group>
                            <Row className="mb-4">
                                <Col>
                                    <Form.Group>
                                        <Form.Label className="font-label text-sm font-bold text-on-surface-variant">התחלה</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                                            onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                                            className="bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-fixed"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className="font-label text-sm font-bold text-on-surface-variant">סיום</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                                            onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                                            className="bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-fixed"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-2">
                                <Form.Check
                                    type="switch"
                                    id="all-day-switch"
                                    label="כל היום"
                                    checked={newEvent.allDay}
                                    onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                                    className="font-bold"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="border-t-0 pt-0">
                        <Button variant="light" onClick={handleCloseModal} className="rounded-full px-4 font-bold text-on-surface-variant hover:bg-surface-variant">
                            ביטול
                        </Button>
                        <Button variant="primary" onClick={handleSaveEvent} className="rounded-full px-6 font-bold bg-primary border-0 hover:bg-primary-dim">
                            שמור אירוע
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Calendar;
