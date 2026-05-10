import React from 'react';
import { MaterialIcon } from './MaterialIcon';

export function CategoryCard({ icon, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-surface-container p-8 rounded-2xl flex flex-col items-center text-center hover:bg-secondary-container transition-colors duration-300 cursor-pointer"
    >
      <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-4 group-hover:bg-on-secondary-container transition-colors duration-300">
        <MaterialIcon
          icon={icon}
          className="text-secondary group-hover:text-surface text-3xl transition-colors duration-300"
        />
      </div>
      <h3 className="font-headline-md text-headline-md mb-2">{title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>
    </div>
  );
}
