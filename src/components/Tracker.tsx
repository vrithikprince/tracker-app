import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TrackerProps {
    date: Date;
    tasks: boolean[];
    taskNames: string[];
    onToggle: (index: number) => void;
}

export const Tracker: React.FC<TrackerProps> = ({ date, tasks, taskNames, onToggle }) => {
    const completed = tasks.filter(t => t).length;
    const total = 10; // Fixed total of 10 tasks
    const percentage = Math.round((completed / total) * 100);

    const data = [
        { name: 'Completed', value: completed },
        { name: 'Remaining', value: total - completed },
    ];

    const COLORS = ['#10b981', '#e2e8f0']; // Emerald, Slate 200

    return (
        <div className="glass-panel p-6 flex flex-col gap-8 items-center justify-between" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <div className="flex-1 w-full" style={{ minWidth: '300px' }}>
                <h3 className="font-bold mb-4" style={{ fontSize: '1.25rem' }}>
                    Tasks for {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {tasks.slice(0, 10).map((checked, index) => (
                        <label key={index} className="flex items-center gap-3 cursor-pointer group" style={{ userSelect: 'none' }}>
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => onToggle(index)}
                                className="custom-checkbox"
                            />
                            <span className="text-sm transition-colors truncate" title={taskNames[index]} style={{ color: checked ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: checked ? 'line-through' : 'none' }}>
                                {taskNames[index] || `Task ${index + 1}`}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="relative flex items-center justify-center" style={{ width: '250px', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={completed === total || completed === 0 ? 0 : 5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center" style={{ inset: 0, pointerEvents: 'none' }}>
                    <span className="font-bold block" style={{ fontSize: '2rem', lineHeight: 1 }}>{percentage}%</span>
                    <span className="text-xs text-gray">Done</span>
                </div>
            </div>
        </div>
    );
};
