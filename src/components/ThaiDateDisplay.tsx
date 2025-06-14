'use client';

import { formatThailandTime, THAI_DATETIME_FORMAT, THAI_DATE_FORMAT, THAI_TIME_FORMAT } from '@/lib/timezone';

interface ThaiDateDisplayProps {
  date: Date | string;
  format?: 'date' | 'time' | 'datetime' | 'full';
  className?: string;
}

export default function ThaiDateDisplay({ 
  date, 
  format = 'datetime', 
  className = '' 
}: ThaiDateDisplayProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const getFormatString = () => {
    switch (format) {
      case 'date':
        return THAI_DATE_FORMAT;
      case 'time':
        return THAI_TIME_FORMAT;
      case 'datetime':
        return THAI_DATETIME_FORMAT;
      case 'full':
        return 'dd/MM/yyyy HH:mm:ss';
      default:
        return THAI_DATETIME_FORMAT;
    }
  };

  const formattedDate = formatThailandTime(dateObj, getFormatString());

  return (
    <span className={className} title={dateObj.toISOString()}>
      {formattedDate}
    </span>
  );
} 