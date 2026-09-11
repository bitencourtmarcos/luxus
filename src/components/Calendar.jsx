import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Video } from 'lucide-react';
import './Calendar.css';

const Calendar = ({ posts, onDateClick, onPostClick, userRole }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const getPostsForDay = (day) => {
    return posts.filter(post => isSameDay(new Date(post.date), day));
  };

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <button onClick={prevMonth} className="month-nav">
          <ChevronLeft size={24} />
        </button>
        <h3>
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button onClick={nextMonth} className="month-nav">
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    return (
      <div className="calendar-grid">
        {weekdays.map((day, i) => (
          <div className="weekday-header" key={i}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dayPosts = getPostsForDay(cloneDay);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            className={`calendar-day ${!isCurrentMonth ? 'empty' : ''} ${isToday ? 'today' : ''}`}
            key={day}
            onClick={() => isCurrentMonth && onDateClick(cloneDay)}
          >
            {isCurrentMonth && (
              <>
                <span className="day-number">{formattedDate}</span>
                <div className="day-posts">
                  {dayPosts.map((post) => (
                    <div 
                      key={post.id}
                      className={`day-post-item ${post.status}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPostClick(post);
                      }}
                    >
                      {post.type === 'video' ? <Video className="post-icon" /> : <ImageIcon className="post-icon" />}
                      <span>
                        {post.status === 'approved' && 'Aprovado - '}
                        {post.status === 'rejected' && 'Reprovado - '}
                        {post.title || 'Post'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-grid" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
