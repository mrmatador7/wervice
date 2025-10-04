'use client';

import React from 'react';
import Dropdown, { DropdownProps } from './Dropdown';

const currencyOptions = [
  { value: 'MAD', label: 'DH MAD' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' }
];

export default function CurrencyDropdown(props: Omit<DropdownProps, 'options'>) {
  return (
    <Dropdown
      {...props}
      options={currencyOptions}
      placeholder="Currency"
      accent="purple"
    />
  );
}
