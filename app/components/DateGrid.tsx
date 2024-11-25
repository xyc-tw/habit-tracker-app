import { format } from 'date-fns';
import { FiCheck } from 'react-icons/fi';
import { RefObject } from 'react';

interface DateGridProps {
  dates: Date[];
  habits: Habit[];
  completions: HabitCompletion[];
  gridRef: RefObject<HTMLDivElement>;
  gridContentRef: RefObject<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onToggleCompletion: (habitId: string, date: Date) => void;
}

interface Habit {
  id: string;
  name: string;
  createdAt: Date;
}

interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}

export default function DateGrid({
  dates,
  habits,
  completions,
  gridRef,
  gridContentRef,
  onScroll,
  onToggleCompletion,
}: DateGridProps) {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Dates Header */}
      <div className="h-20 border-b">
        <div 
          ref={gridRef}
          className="h-full overflow-x-auto"
          onScroll={onScroll}
        >
          <div className="flex h-full min-w-max">
            {dates.map(date => (
              <div 
                key={date.toISOString()}
                className="w-16 flex-shrink-0 flex flex-col items-center justify-center border-r"
              >
                <div className="text-sm text-gray-600">{format(date, 'MMM')}</div>
                <div className="text-lg font-medium">{format(date, 'd')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div 
        ref={gridContentRef}
        className="flex-1 overflow-x-auto"
        onScroll={onScroll}
      >
        <div className="min-w-max">
          {habits.map(habit => (
            <div key={habit.id} className="flex border-b">
              {dates.map(date => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const isCompleted = completions.some(
                  c => c.habitId === habit.id && c.date === dateStr
                );
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => onToggleCompletion(habit.id, date)}
                    className={`w-16 h-16 border-r flex items-center justify-center
                      ${isCompleted ? 'bg-green-100' : 'hover:bg-gray-50'}`}
                  >
                    {isCompleted && <FiCheck className="h-5 w-5 text-green-600" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 