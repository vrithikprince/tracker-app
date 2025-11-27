import React, { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, LogOut, Edit2, Save, X, RotateCcw } from 'lucide-react';
import { Tracker } from './Tracker';
import { WeekView } from './WeekView';
import { ProgressChart } from './ProgressChart';
import { Summary } from './Summary';

interface DashboardProps {
    onLogout: () => void;
}

const DEFAULT_TASKS = [
    "SQL",
    "Read Book",
    "Stay Hydrated",
    "Atleast 30 mins of exercise",
    "Practice 1-2 SQL Questions",
    "Good Food",
    "Work on updating profile",
    "Productive Day",
    "Any other career related Learning",
    "20 Minutes of NewsPaper"
];

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState<{ [key: string]: boolean[] }>({});
    const [dailyTaskNames, setDailyTaskNames] = useState<{ [key: string]: string[] }>({});
    const [isEditingHabits, setIsEditingHabits] = useState(false);
    const [tempTaskNames, setTempTaskNames] = useState<string[]>([]);

    // Load data from local storage
    useEffect(() => {
        const savedTasks = localStorage.getItem('tracker_tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }

        const savedDailyNames = localStorage.getItem('tracker_daily_task_names');
        if (savedDailyNames) {
            setDailyTaskNames(JSON.parse(savedDailyNames));
        }
    }, []);

    // Save data to local storage
    useEffect(() => {
        localStorage.setItem('tracker_tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('tracker_daily_task_names', JSON.stringify(dailyTaskNames));
    }, [dailyTaskNames]);

    const getWeekDays = (date: Date) => {
        const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
        const end = endOfWeek(date, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    };

    const weekDays = getWeekDays(selectedDate);
    const dateKey = format(selectedDate, 'yyyy-MM-dd');

    // Get tasks for current date
    const currentTasks = tasks[dateKey] || Array(10).fill(false);
    // Fix length if it doesn't match 10
    if (currentTasks.length !== 10) {
        if (currentTasks.length < 10) {
            currentTasks.push(...Array(10 - currentTasks.length).fill(false));
        } else {
            currentTasks.length = 10;
        }
    }

    // Get task names for current date (or default)
    const currentTaskNames = dailyTaskNames[dateKey] || DEFAULT_TASKS;

    const handleToggle = (index: number) => {
        const newTasks = [...currentTasks];
        newTasks[index] = !newTasks[index];
        setTasks(prev => ({
            ...prev,
            [dateKey]: newTasks
        }));
    };

    const startEditing = () => {
        setTempTaskNames([...currentTaskNames]);
        setIsEditingHabits(true);
    };

    const handleSaveHabits = () => {
        setDailyTaskNames(prev => ({
            ...prev,
            [dateKey]: tempTaskNames
        }));
        setIsEditingHabits(false);
    };

    const handleResetHabits = () => {
        setTempTaskNames([...DEFAULT_TASKS]);
    };

    const handleTaskNameChange = (index: number, value: string) => {
        const newNames = [...tempTaskNames];
        newNames[index] = value;
        setTempTaskNames(newNames);
    };

    // Prepare data for chart
    const chartData = weekDays.map(day => {
        const key = format(day, 'yyyy-MM-dd');
        const dayTasks = tasks[key] || Array(10).fill(false);
        const validTasks = dayTasks.slice(0, 10);
        const completed = validTasks.filter(t => t).length;
        return {
            date: day,
            percentage: Math.round((completed / 10) * 100)
        };
    });

    return (
        <div className="min-h-screen p-4 max-w-7xl mx-auto" style={{ padding: '2rem' }}>
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold gradient-text bg-clip-text text-transparent">Habit Tracker</h1>
                    <p className="text-gray">Track your daily progress</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="relative">
                        <input
                            type="date"
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={(e) => e.target.value && setSelectedDate(parseISO(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            style={{ zIndex: 20 }}
                            onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                        />
                        <button className="glass-panel px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors relative z-10">
                            <CalendarIcon size={18} className="text-accent" />
                            <span>{format(selectedDate, 'MMM yyyy')}</span>
                        </button>
                    </div>

                    <button
                        onClick={onLogout}
                        className="glass-panel p-2 hover:bg-white/5 transition-colors"
                        title="Logout"
                        style={{ color: '#ef4444' }}
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <Summary tasks={tasks} taskNames={DEFAULT_TASKS} />

            <WeekView
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                weekDays={weekDays}
            />

            {/* Habit Customization Section */}
            <div className="mb-8">
                {!isEditingHabits ? (
                    <div className="flex justify-end">
                        <button
                            onClick={startEditing}
                            className="glass-panel px-4 py-2 flex items-center gap-2 text-sm font-semibold text-accent hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md"
                        >
                            <Edit2 size={16} />
                            Customize Habits for {format(selectedDate, 'MMM d')}
                        </button>
                    </div>
                ) : (
                    <div className="glass-panel p-8 mb-6 animate-fade-in relative overflow-hidden">
                        <div className="gradient-border-top"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h3 className="font-bold text-xl" style={{ color: '#1e293b' }}>Customize Habits</h3>
                                <p className="text-sm mt-1" style={{ color: '#64748b' }}>Editing habits for <span className="font-bold" style={{ color: '#059669' }}>{format(selectedDate, 'MMMM d, yyyy')}</span></p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleResetHabits}
                                    className="btn-action btn-ghost"
                                    title="Reset to default tasks"
                                >
                                    <RotateCcw size={16} />
                                    Reset
                                </button>
                                <button
                                    onClick={() => setIsEditingHabits(false)}
                                    className="btn-action btn-outline"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveHabits}
                                    className="btn-action btn-success"
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        <div className="grid-cols-1-md-2">
                            {tempTaskNames.map((name, index) => (
                                <div key={index} className="habit-input-wrapper">
                                    <div className="habit-input-badge">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => handleTaskNameChange(index, e.target.value)}
                                        className="habit-input"
                                        placeholder={`Enter habit name...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6 w-full">
                <div className="w-full">
                    <Tracker
                        date={selectedDate}
                        tasks={currentTasks}
                        taskNames={currentTaskNames}
                        onToggle={handleToggle}
                    />
                </div>

                <div className="w-full">
                    <ProgressChart data={chartData} />
                </div>
            </div>
        </div>
    );
};
