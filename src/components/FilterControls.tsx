import React from 'react';
import type { SortOption, SortOrder, FilterOptions, Category } from '../types';

interface FilterControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  filters: FilterOptions;
  onSortChange: (sortBy: SortOption) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  sortBy,
  sortOrder,
  filters,
  onSortChange,
  onSortOrderChange,
  onFilterChange,
}) => {
  return (
    <div className="bg-dark-card rounded-xl p-4 border-2 border-dark-border mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Сортировка</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">По дате платежа</option>
            <option value="cost">По стоимости</option>
            <option value="name">По названию</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Порядок</label>
          <div className="flex gap-2">
            <button
              onClick={() => onSortOrderChange('asc')}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                sortOrder === 'asc'
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-dark-bg border-dark-border'
              }`}
            >
              {sortBy === 'date' ? '↑ Раньше' : sortBy === 'cost' ? '↑ Дешевле' : '↑ А-Я'}
            </button>
            <button
              onClick={() => onSortOrderChange('desc')}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                sortOrder === 'desc'
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-dark-bg border-dark-border'
              }`}
            >
              {sortBy === 'date' ? '↓ Позже' : sortBy === 'cost' ? '↓ Дороже' : '↓ Я-А'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Категория</label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                category: e.target.value ? (e.target.value as Category) : undefined,
              })
            }
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все категории</option>
            <option value="AI">AI</option>
            <option value="Design">Design</option>
            <option value="Music">Music</option>
            <option value="Video">Video</option>
            <option value="Productivity">Productivity</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {(filters.category) && (
        <div className="mt-3 flex gap-2">
          <span className="text-sm text-gray-400">Активные фильтры:</span>
          {filters.category && (
            <button
              onClick={() => onFilterChange({ ...filters, category: undefined })}
              className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition"
            >
              {filters.category} ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};
