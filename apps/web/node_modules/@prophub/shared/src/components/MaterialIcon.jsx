import React from 'react';

export function MaterialIcon({ icon, className = '', style = {} }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={style}
    >
      {icon}
    </span>
  );
}
