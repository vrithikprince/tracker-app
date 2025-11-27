import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';

interface WeekViewProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    weekDays: Date[];
}

export const WeekView: React.FC<WeekViewProps> = ({ selectedDate, onSelectDate, weekDays }) => {
    return (
        <div className="glass-panel p-4 mb-6 overflow-x-auto">
            <div className="flex justify-between gap-2" style={{ minWidth: '600px' }}>
                {weekDays.map((day) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrent = isToday(day);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => onSelectDate(day)}
                            className="flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 flex-1"
                            style={{
                                background: isSelected ? 'linear-gradient(135deg, var(--accent), #8b5cf6)' : 'transparent',
                                border: isCurrent && !isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                borderRadius: '16px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <span className="text-xs mb-1" style={{ color: isSelected ? 'white' : 'var(--text-secondary)' }}>
                                {format(day, 'EEE')}
                            </span>
                            <span className="text-xl font-bold" style={{ color: isSelected ? 'white' : 'var(--text-primary)' }}>
                                {format(day, 'd')}
                            </span>
                            {isCurrent && (
                                <div style={{ marginTop: '4px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
