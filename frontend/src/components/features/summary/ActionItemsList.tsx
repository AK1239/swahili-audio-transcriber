/** Action items list component */
import React from 'react';
import { Card } from '../../ui/Card';
import { ActionItem } from '../../../types/summary';

interface ActionItemsListProps {
  items: ActionItem[];
}

export const ActionItemsList: React.FC<ActionItemsListProps> = ({ items }) => {
  return (
    <Card title="Kazi za Kufuatilia">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.task}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Nani:</span> {item.person}
                </p>
                {item.dueDate && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tarehe:</span> {item.dueDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

