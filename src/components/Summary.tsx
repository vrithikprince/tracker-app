import React, { useEffect, useState } from 'react';
import { differenceInDays, parseISO } from 'date-fns';

interface SummaryProps {
    tasks: { [key: string]: boolean[] };
    taskNames: string[];
}

export const Summary: React.FC<SummaryProps> = ({ tasks, taskNames }) => {
    const [kpis, setKpis] = useState({ currentStreak: 0, bestStreak: 0, avgTasks: 0, topTasks: ['None', 'None'] });

    useEffect(() => {
        calculateKPIs(tasks);
    }, [tasks, taskNames]);

    const calculateKPIs = (data: { [key: string]: boolean[] }) => {
        // Filter out dates that have no completed tasks (e.g. user toggled on then off)
        const activeDates = Object.keys(data).filter(date =>
            data[date].some(completed => completed)
        );

        if (activeDates.length === 0) {
            setKpis({ currentStreak: 0, bestStreak: 0, avgTasks: 0, topTasks: ['None', 'None'] });
            return;
        }

        // Sort dates in descending order (most recent first)
        const sortedDates = activeDates.sort().reverse();

        // 1. Calculate Current Streak (Snapchat style - consecutive days with activity)
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if today or yesterday has activity
        const todayStr = today.toISOString().split('T')[0];
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const hasActivityToday = sortedDates.includes(todayStr);
        const hasActivityYesterday = sortedDates.includes(yesterdayStr);
        
        // Only count streak if there's activity today or yesterday
        if (hasActivityToday || hasActivityYesterday) {
            let checkDate = new Date(today);
            if (!hasActivityToday && hasActivityYesterday) {
                checkDate = yesterday;
            }
            
            // Count consecutive days backward
            while (true) {
                const checkStr = checkDate.toISOString().split('T')[0];
                if (sortedDates.includes(checkStr)) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        // 2. Calculate Best Streak (longest consecutive days in history)
        let bestStreak = 0;
        let tempStreak = 0;
        const allDates = activeDates.sort();
        
        for (let i = 0; i < allDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prevDate = parseISO(allDates[i - 1]);
                const currDate = parseISO(allDates[i]);
                const daysDiff = differenceInDays(currDate, prevDate);
                
                if (daysDiff === 1) {
                    tempStreak++;
                } else {
                    bestStreak = Math.max(bestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        }
        bestStreak = Math.max(bestStreak, tempStreak);

        // 3. Average Tasks (Per active day)
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

        // 4. Top 2 Tasks
        const tasksWithIndex = taskCounts.map((count, index) => ({ count, index }));
        tasksWithIndex.sort((a, b) => b.count - a.count);

        const topTasks = [
            tasksWithIndex[0].count > 0 ? (taskNames[tasksWithIndex[0].index] || `Task ${tasksWithIndex[0].index + 1}`) : 'None',
            tasksWithIndex[1].count > 0 ? (taskNames[tasksWithIndex[1].index] || `Task ${tasksWithIndex[1].index + 1}`) : 'None'
        ];

        setKpis({ currentStreak, bestStreak, avgTasks, topTasks });
    };

    return (
        <div className="w-full mb-8 animate-fade-in">
            <div className="grid grid-cols-4 gap-4">
                {/* Card 1: Current Streak (Snapchat Style) */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/50 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">🔥 Tracker Active</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-orange-500">{kpis.currentStreak}</span>
                        <span className="text-xs text-slate-500">days</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Current Streak</p>
                </div>

                {/* Card 2: Best Streak */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/50 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">🏆 Best Streak</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-purple-500">{kpis.bestStreak}</span>
                        <span className="text-xs text-slate-500">days</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Longest Run</p>
                </div>

                {/* Card 3: Average Tasks */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/50 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">📊 Daily Average</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-emerald-500">{kpis.avgTasks}</span>
                        <span className="text-xs text-slate-500">tasks</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Per Active Day</p>
                </div>

                {/* Card 4: Top Habits */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/50 transition-colors">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">⭐ Top Habits</h3>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-bold text-slate-800 truncate max-w-[150px]" title={kpis.topTasks[0]}>1. {kpis.topTasks[0]}</span>
                        <span className="text-sm font-bold text-slate-600 truncate max-w-[150px]" title={kpis.topTasks[1]}>2. {kpis.topTasks[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
