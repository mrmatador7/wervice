'use client';

import React from 'react';
import WervSelect, { WervSelectOption } from './WervSelect';

const currencyOptions: WervSelectOption[] = [
  { value: 'MAD', label: 'DH MAD' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' }
];

interface CurrencyDropdownProps {
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function CurrencyDropdown({ value, onChange, disabled = false, className }: CurrencyDropdownProps) {
  return (
    <WervSelect
      value={value}
      onChange={onChange}
      options={currencyOptions}
      placeholder="Currency"
      accent="default"
      className={className}
    />
  );
}
