import React from 'react';
import { InsuranceObject } from '@/data/mockObjects';
import ObjectRow from './ObjectRow';

interface ObjectListViewProps {
  objects: InsuranceObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
}

const ObjectListView = ({ objects, selectedObjectId, onSelectObject }: ObjectListViewProps) => {
  if (objects.length === 0) {
    return (
      <p className="text-sm px-4 py-3" style={{ color: 'var(--pw-text-tertiary)' }}>
        Inga objekt
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {objects.map((obj) => (
        <ObjectRow
          key={obj.id}
          object={obj}
          isSelected={selectedObjectId === obj.id}
          onClick={() => onSelectObject(obj.id)}
        />
      ))}
    </div>
  );
};

export default ObjectListView;
