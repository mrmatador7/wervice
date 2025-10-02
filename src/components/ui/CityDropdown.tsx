'use client';

import React from 'react';
import Dropdown, { DropdownProps } from './Dropdown';

const cityOptions = [
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

interface CityDropdownProps extends Omit<DropdownProps, 'options'> {
  // Inherits all DropdownProps except options
}

export default function CityDropdown(props: CityDropdownProps) {
  return (
    <Dropdown
      {...props}
      options={cityOptions}
      placeholder="Select a city"
      accent="purple"
      iconSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIyczctNS4yIDctMTJhNyA3IDAgMSAwLTE0IDBjMCA2LjggNyAxMiA3IDEyWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzZiNzI4MCIvPgo8L3N2Zz4K"
    />
  );
}
