import React from 'react';

const StatCard = ({ title, value, color = 'bg-blue-500' }) => (
  <div className={`p-6 text-white ${color} rounded-lg shadow-md`}>
    <div className="text-sm font-medium uppercase">{title}</div>
    <div className="mt-2 text-3xl font-bold">{value}</div>
  </div>
);

export default StatCard;