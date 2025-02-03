'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, subDays, startOfToday } from 'date-fns';
import { PlusCircle, Check, Calendar, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './components/Header';

interface Habit {
  id: number;
  name: string;
  tracked: {
    [key: string]: boolean;
  };
}

export default function Page() {
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
      day: 'numeric'
    }).format(date);
  };

  const formatWeekday = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short'
    }).format(date).toUpperCase();
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

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow" style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      {/* Main content - Horizontal layout */}
      <div style={{ display: 'flex', gap: '24px' }}> {/* Added gap between left and right sections */}
        {/* Left side - Habits List */}
        <div className="w-64 p-6 border-r" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px', // Increased gap between habit items and "Add Habit" button
          textAlign: 'center' // Center-align text in habit list
        }}>
          {/* Blank space to align with date headers */}
          <div style={{ height: '48px' }}></div> {/* Adjust height as needed */}
          {habits.map(habit => (
            <div
              key={habit.id}
              className="p-2 rounded hover:bg-gray-100 cursor-pointer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: '48px' // Set fixed height for habit items
              }}
            >
              {editingHabitId === habit.id ? (
                <input
                  type="text"
                  defaultValue={habit.name}
                  onBlur={(e) => updateHabitName(habit.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateHabitName(habit.id, e.currentTarget.value)}
                  className="w-full px-2 py-1 border rounded"
                  style={{ flex: 1 }}
                  autoFocus
                />
              ) : (
                <>
                  <span className="font-medium" style={{ flex: 1 }}>{habit.name}</span>
                  <button
                    onClick={() => setEditingHabitId(habit.id)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          ))}
          {habits.length < 10 && (
            <button
              onClick={addHabit}
              className="w-full p-2 border rounded text-gray-500 hover:bg-gray-50 cursor-pointer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '48px' // Set fixed height for "Add Habit" button
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Add Habit
            </button>
          )}
        </div>

        {/* Right side - Calendar Grid */}
        <div className="p-6" style={{ flex: 1 }}>
          <div className="border rounded-lg overflow-hidden">
            <div ref={scrollRef} className="overflow-x-auto">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`, 
                gap: '16px' // Added gap between date headers and habit rows
              }}>
                {/* Date Headers */}
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className={`w-16 p-3 text-center border-r border-b
                      ${isToday(date) ? 'bg-blue-50 font-bold' : ''}`} // Increased width and padding
                    style={{ 
                      padding: '8px', // Added padding to date cells
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div>{formatDate(date)}</div>
                    <div>{formatWeekday(date)}</div>
                  </div>
                ))}

                {/* Habit Rows */}
                {habits.map(habit => (
                  dates.map((date, index) => {
                    const dateString = date.toISOString().split('T')[0];
                    const status = habit.tracked[dateString];
                    
                    return (
                      <div 
                        key={`${habit.id}-${index}`}
                        onClick={() => toggleHabitStatus(habit.id, dateString)}
                        className={`w-16 h-16 border-r border-b cursor-pointer
                          ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} ${status ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-gray-50'}`} // Alternating background colors
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '48px' // Set fixed height for grid cells
                        }}
                      >
                        {status && <Check className="w-5 h-5 text-green-600" />}
                      </div>
                    );
                  })
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}