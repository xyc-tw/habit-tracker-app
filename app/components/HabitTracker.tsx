'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfToday } from 'date-fns';
import { PlusCircle, Check, Calendar, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Habit {
  id: number;
  name: string;
  tracked: {
    [key: string]: boolean;
  };
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate dates for current month
  useEffect(() => {
    const newDates: Date[] = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      newDates.push(new Date(d));
    }
    
    setDates(newDates);
  }, [currentMonth]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const toggleHabitStatus = (habitId: number, dateString: string): void => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newTracked = { ...habit.tracked };
        newTracked[dateString] = !newTracked[dateString];
        return { ...habit, tracked: newTracked };
      }
      return habit;
    }));
  };

  const addHabit = (): void => {
    if (habits.length < 10) {
      const newHabit: Habit = {
        id: Date.now(),
        name: 'New Habit',
        tracked: {}
      };
      setHabits([...habits, newHabit]);
      setEditingHabitId(newHabit.id);
    }
  };

  const updateHabitName = (habitId: number, newName: string): void => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, name: newName } : habit
    ));
    setEditingHabitId(null);
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    setCurrentMonth(new Date(year, month - 1));
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Habit Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-100 text-sm"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <select
              value={`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`}
              onChange={handleMonthChange}
              className="p-2 border rounded"
            >
              {Array.from({ length: 12 }).map((_, index) => {
                const date = new Date(currentMonth.getFullYear(), index);
                return (
                  <option key={index} value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`}>
                    {format(date, 'MMMM yyyy')}
                  </option>
                );
              })}
            </select>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content - Horizontal layout */}
      <div className="flex">
        {/* Left side - Habits List */}
        <div className="w-64 p-6 border-r">
          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                {editingHabitId === habit.id ? (
                  <input
                    type="text"
                    defaultValue={habit.name}
                    onBlur={(e) => updateHabitName(habit.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && updateHabitName(habit.id, e.currentTarget.value)}
                    className="flex-1 px-2 py-1 border rounded"
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="flex-1 font-medium">{habit.name}</span>
                    <button
                      onClick={() => setEditingHabitId(habit.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </>
                )}
              </div>
            ))}
            {habits.length < 10 && (
              <button
                onClick={addHabit}
                className="w-full p-2 border rounded flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50"
              >
                <PlusCircle className="w-4 h-4" />
                Add Habit
              </button>
            )}
          </div>
        </div>

        {/* Right side - Calendar Grid */}
        <div className="flex-1 p-6">
          <div className="border rounded-lg overflow-hidden">
            <div ref={scrollRef} className="overflow-x-auto">
              <div className="inline-flex flex-col min-w-full">
                {/* Date Headers */}
                <div className="flex border-b bg-gray-50">
                  {dates.map((date, index) => (
                    <div
                      key={index}
                      className={`w-14 p-2 text-center border-r last:border-r-0
                        ${isToday(date) ? 'bg-blue-50 font-bold' : ''}`}
                    >
                      {formatDate(date)}
                    </div>
                  ))}
                </div>

                {/* Habit Rows */}
                {habits.map(habit => (
                  <div key={habit.id} className="flex">
                    {dates.map((date, index) => {
                      const dateString = date.toISOString().split('T')[0];
                      const status = habit.tracked[dateString];
                      
                      return (
                        <div 
                          key={index}
                          onClick={() => toggleHabitStatus(habit.id, dateString)}
                          className={`w-14 h-14 border-r last:border-r-0 border-b flex items-center justify-center cursor-pointer
                            ${status ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-gray-50'}`}
                        >
                          {status && <Check className="w-5 h-5 text-green-600" />}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}