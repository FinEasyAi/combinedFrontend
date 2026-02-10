
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarCard.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarCard() {
    const [date, setDate] = useState<Value>(new Date());

    return (
        <div className="calendar-card status-card">
            <h3 className="card-title">Calendar</h3>
            <Calendar
                onChange={setDate}
                value={date}
                className="custom-calendar"
            />
        </div>
    );
}
