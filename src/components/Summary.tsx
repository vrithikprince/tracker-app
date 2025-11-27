import React, { useEffect, useState } from 'react';
import { differenceInDays, parseISO } from 'date-fns';

interface SummaryProps {
    tasks: { [key: string]: boolean[] };
    taskNames: string[];
}

export const Summary: React.FC<SummaryProps> = ({ tasks, taskNames }) => {
    const [kpis, setKpis] = useState({ duration: 0, avgTasks: 0, topTasks: ['None', 'None'] });

    useEffect(() => {
        calculateKPIs(tasks);
    }, [tasks, taskNames]);

    const calculateKPIs = (data: { [key: string]: boolean[] }) => {
        // Filter out dates that have no completed tasks (e.g. user toggled on then off)
        const activeDates = Object.keys(data).filter(date =>
            data[date].some(completed => completed)
        );

        if (activeDates.length === 0) {
            setKpis({ duration: 0, avgTasks: 0, topTasks: ['None', 'None'] });
            return;
        }

        // 1. Duration (Days since first active entry)
        const sortedDates = activeDates.sort();
        const startDate = parseISO(sortedDates[0]);
        const duration = differenceInDays(new Date(), startDate) + 1;

        // 2. Average Tasks (Per active day)
        let totalCompleted = 0;
        const taskCounts = Array(10).fill(0); // Fixed 10 tasks

        activeDates.forEach(date => {
            // Ensure we only count up to 10 tasks
            const dayTasks = data[date].slice(0, 10);
            dayTasks.forEach((completed, index) => {
                if (completed) {
                    totalCompleted++;
                    taskCounts[index]++;
                }
            });
        });

        const avgTasks = Math.round((totalCompleted / activeDates.length) * 10) / 10;

        // 3. Top 2 Tasks
        const tasksWithIndex = taskCounts.map((count, index) => ({ count, index }));
        tasksWithIndex.sort((a, b) => b.count - a.count);

        const topTasks = [
            tasksWithIndex[0].count > 0 ? (taskNames[tasksWithIndex[0].index] || `Task ${tasksWithIndex[0].index + 1}`) : 'None',
            tasksWithIndex[1].count > 0 ? (taskNames[tasksWithIndex[1].index] || `Task ${tasksWithIndex[1].index + 1}`) : 'None'
        ];

        setKpis({ duration, avgTasks, topTasks });
    };

    return (
        <div className="w-full mb-8 animate-fade-in">
            <div className="grid grid-cols-4 gap-4">
                {/* Card 1: Duration */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/50 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Tracker Active</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-800">{kpis.duration}</span>
                        <span className="text-xs text-slate-500">days</span>
                    </div>
                </div>

                {/* Card 2: Average Tasks */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/50 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Daily Average</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-emerald-500">{kpis.avgTasks}</span>
                        <span className="text-xs text-slate-500">tasks</span>
                    </div>
                </div>

                {/* Card 3: Top Task 1 */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/50 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Top Habit #1</h3>
                    <div className="flex items-center">
                        <span className="text-lg font-bold text-slate-800 truncate max-w-[150px]" title={kpis.topTasks[0]}>{kpis.topTasks[0]}</span>
                    </div>
                </div>

                {/* Card 4: Top Task 2 */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/50 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Top Habit #2</h3>
                    <div className="flex items-center">
                        <span className="text-lg font-bold text-slate-800 truncate max-w-[150px]" title={kpis.topTasks[1]}>{kpis.topTasks[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
