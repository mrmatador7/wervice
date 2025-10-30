'use client';

import React from 'react';
import WervSelect, { WervSelectOption } from './WervSelect';

const cityOptions: WervSelectOption[] = [
  { value: 'casablanca', label: 'Casablanca' },
  { value: 'marrakech', label: 'Marrakech' },
  { value: 'rabat', label: 'Rabat' },
  { value: 'tanger', label: 'Tanger' },
  { value: 'agadir', label: 'Agadir' },
  { value: 'fes', label: 'Fes' },
  { value: 'meknes', label: 'Meknes' },
  { value: 'el-jadida', label: 'El Jadida' },
  { value: 'kenitra', label: 'Kenitra' }
];

interface CityDropdownProps {
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function CityDropdown({ value, onChange, disabled = false, className }: CityDropdownProps) {
  return (
    <WervSelect
      value={value}
      onChange={onChange}
      options={cityOptions}
      placeholder="Select a city"
      accent="default"
      className={className}
    />
  );
}
