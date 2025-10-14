import { type ReactNode, useState } from 'react';

export interface ProgressiveDisclosureProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ProgressiveDisclosure({
  title,
  children,
  defaultOpen = false,
  className = ''
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      open={defaultOpen}
      className={`group ${className}`}
      onToggle={e => setIsOpen((e.target as HTMLDetailsElement).open)}
      aria-expanded={isOpen}
    >
      <summary
        className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-800 p-4 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
      >
        <span className="font-medium text-base">{title}</span>
        <svg
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div
        className="mt-2 space-y-2 px-4 pb-4 animate-fadeIn"
        role="region"
        aria-label={`${title} content`}
      >
        {children}
      </div>
    </details>
  );
}

export interface CheckboxItemProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxItem({ label, value, checked, onChange }: CheckboxItemProps) {
  return (
    <label
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors min-h-[48px]"
      aria-label={label}
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="h-5 w-5 min-h-[48px] min-w-[48px] rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-gray-900 transition-all"
        aria-checked={checked}
        aria-describedby={`${value}-description`}
      />
      <span className="text-white text-base" id={`${value}-description`}>
        {label}
      </span>
    </label>
  );
}

export interface RadioItemProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  name: string;
}

export function RadioItem({ label, value, checked, onChange, name }: RadioItemProps) {
  return (
    <label
      className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors min-h-[48px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 ${
        checked ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
      }`}
      aria-label={label}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        aria-checked={checked}
      />
      <span className="font-medium text-base">{label}</span>
    </label>
  );
}
