'use client';

import React from 'react';
import Dropdown, { DropdownProps } from './Dropdown';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' }
];

interface LanguageDropdownProps extends Omit<DropdownProps, 'options'> {
  // Inherits all DropdownProps except options
}

export default function LanguageDropdown(props: LanguageDropdownProps) {
  return (
    <Dropdown
      {...props}
      options={languageOptions}
      placeholder="Language"
      accent="neon"
    />
  );
}
