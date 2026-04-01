'use client';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface ScheduleButtonProps {
  label: string;
  formType?: string;
  className?: string;
}

export default function ScheduleButton({
  label,
  formType,
  className,
}: ScheduleButtonProps) {
  const handleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'schedule_click',
      form_type: formType || '',
    });
  };

  return (
    <a
      href="https://calendar.app.google/z48uzMWqwPogLo9X6"
      target="_blank"
      rel="noopener noreferrer"
      className={className || 'thanks-cta'}
      onClick={handleClick}
    >
      {label}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    </a>
  );
}
