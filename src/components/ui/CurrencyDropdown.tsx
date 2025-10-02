'use client';

import React from 'react';
import Dropdown, { DropdownProps } from './Dropdown';

const currencyOptions = [
  { value: 'MAD', label: 'DH MAD' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' }
];

interface CurrencyDropdownProps extends Omit<DropdownProps, 'options'> {
  // Inherits all DropdownProps except options
}

export default function CurrencyDropdown(props: CurrencyDropdownProps) {
  return (
    <Dropdown
      {...props}
      options={currencyOptions}
      placeholder="Currency"
      accent="purple"
    />
  );
}
