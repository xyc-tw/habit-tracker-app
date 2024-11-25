import { FiPlus } from 'react-icons/fi';

interface Habit {
  id: string;
  name: string;
  createdAt: Date;
}

interface HabitsListProps {
  habits: Habit[];
  editingHabitId: string | null;
  editingHabitName: string;
  onAddHabit: () => void;
  onStartEditing: (habit: Habit) => void;
  onSaveHabitName: () => void;
  onEditingNameChange: (name: string) => void;
}

export default function HabitsList({
  habits,
  editingHabitId,
  editingHabitName,
  onAddHabit,
  onStartEditing,
  onSaveHabitName,
  onEditingNameChange,
}: HabitsListProps) {
  return (
    <aside className="w-64 border-r overflow-y-auto">
      <div className="p-4 space-y-3">
        {habits.map(habit => (
          <div key={habit.id} className="border rounded p-2">
            {editingHabitId === habit.id ? (
              <input
                type="text"
                value={editingHabitName}
                onChange={(e) => onEditingNameChange(e.target.value)}
                onBlur={onSaveHabitName}
                onKeyPress={(e) => e.key === 'Enter' && onSaveHabitName()}
                className="w-full border rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <div onClick={() => onStartEditing(habit)}>
                {habit.name}
              </div>
            )}
          </div>
        ))}
        {habits.length < 10 && (
          <button
            onClick={onAddHabit}
            className="w-full border rounded p-2 text-gray-500"
          >
            <FiPlus className="inline mr-2" />
            Add Habit
          </button>
        )}
      </div>
    </aside>
  );
} 