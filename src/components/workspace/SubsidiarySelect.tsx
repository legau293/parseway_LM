import React from 'react';
import { Subsidiary } from '@/data/mockWorkspace';

interface SubsidiarySelectProps {
  subsidiaries: Subsidiary[];
  selectedSubsidiaryId: string;
  onChange: (id: string) => void;
}

const SubsidiarySelect = ({ subsidiaries, selectedSubsidiaryId, onChange }: SubsidiarySelectProps) => {
  return (
    <div className="mb-6">
      <label
        className="block text-sm mb-1.5"
        style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
      >
        Dotterbolag
      </label>
      <select
        value={selectedSubsidiaryId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm rounded px-3 py-2 outline-none transition-colors"
        style={{
          backgroundColor: 'var(--pw-bg-primary)',
          border: '1px solid var(--pw-border)',
          color: 'var(--pw-text-primary)',
          fontWeight: 400,
          appearance: 'auto',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
      >
        {subsidiaries.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubsidiarySelect;
