# Modern Dropdown Components Guide

This guide explains how to use the new modern dropdown components throughout the Wervice website.

## 📦 Available Components

### 1. **LanguageCurrencyDropdown** (Specialized)
Located: `/src/components/ui/LanguageDropdown.tsx`

The language/currency selector used in the header. Features:
- Language switching (EN, FR, AR)
- Currency selection (USD, EUR, MAD)
- Persistent currency preference in localStorage
- Modern dropdown styling with sections

**Usage:**
```tsx
import LanguageCurrencyDropdown from '@/components/ui/LanguageDropdown';

<LanguageCurrencyDropdown />
```

---

### 2. **Dropdown** (Generic - Reusable)
Located: `/src/components/ui/Dropdown.tsx`

A fully reusable dropdown component with modern styling.

#### Basic Usage:

```tsx
import Dropdown, { 
  DropdownSection, 
  DropdownItem, 
  DropdownDivider, 
  DropdownTrigger 
} from '@/components/ui/Dropdown';

<Dropdown
  trigger={
    <DropdownTrigger>
      Select Option
    </DropdownTrigger>
  }
  align="right"
  width="w-80"
>
  <DropdownSection title="SECTION 1">
    <DropdownItem onClick={() => console.log('Item 1')}>
      Item 1
    </DropdownItem>
    <DropdownItem onClick={() => console.log('Item 2')} active>
      Item 2
    </DropdownItem>
  </DropdownSection>
  
  <DropdownDivider />
  
  <DropdownSection title="SECTION 2">
    <DropdownItem 
      onClick={() => console.log('Item 3')}
      icon={<IconComponent />}
      rightContent="$"
    >
      Item 3
    </DropdownItem>
  </DropdownSection>
</Dropdown>
```

#### Props:

**Dropdown:**
- `trigger`: ReactNode or function - The clickable element that opens the dropdown
- `children`: ReactNode - The dropdown content
- `align`: 'left' | 'right' - Alignment of dropdown (default: 'right')
- `width`: string - Width class (default: 'w-80')
- `className`: string - Additional classes

**DropdownSection:**
- `title`: string - Section heading (uppercase)
- `children`: ReactNode - Section items
- `noPadding`: boolean - Remove default padding

**DropdownItem:**
- `children`: ReactNode - Item content
- `onClick`: () => void - Click handler
- `active`: boolean - Highlight as active
- `icon`: ReactNode - Left icon/emoji
- `rightContent`: ReactNode - Right-side content (e.g., currency symbol)
- `disabled`: boolean - Disable interaction

**DropdownTrigger:**
- `children`: ReactNode - Button content
- `isOpen`: boolean - Show open state
- `className`: string - Additional classes

---

## 🎨 Design System

### Colors
- **Border**: `border-zinc-200`
- **Background**: `bg-white`
- **Hover**: `bg-zinc-50`
- **Active**: `bg-zinc-100`
- **Text**: `text-zinc-900` (primary), `text-zinc-500` (secondary)

### Typography
- **Section Titles**: `text-xs font-bold uppercase tracking-wider text-zinc-500`
- **Items**: `text-base font-medium` (regular), `font-bold` (active)
- **Trigger**: `text-sm font-semibold`

### Spacing
- **Rounded Corners**: `rounded-xl` (12px) or `rounded-2xl` (16px)
- **Padding**: `p-6` for sections, `px-4 py-3.5` for items
- **Gaps**: `gap-4` for icons/content

---

## 📋 Examples

### Example 1: User Menu Dropdown

```tsx
import Dropdown, { DropdownSection, DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';
import { User, Settings, LogOut } from 'lucide-react';

<Dropdown
  trigger={
    <button className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5">
      <User className="h-4 w-4" />
      <span className="font-semibold">Account</span>
    </button>
  }
>
  <DropdownSection title="Account">
    <DropdownItem 
      onClick={() => router.push('/profile')}
      icon={<User className="h-5 w-5" />}
    >
      My Profile
    </DropdownItem>
    <DropdownItem 
      onClick={() => router.push('/settings')}
      icon={<Settings className="h-5 w-5" />}
    >
      Settings
    </DropdownItem>
  </DropdownSection>
  
  <DropdownDivider />
  
  <DropdownSection noPadding>
    <div className="p-4">
      <DropdownItem 
        onClick={handleSignOut}
        icon={<LogOut className="h-5 w-5 text-red-500" />}
      >
        <span className="text-red-500">Sign Out</span>
      </DropdownItem>
    </div>
  </DropdownSection>
</Dropdown>
```

### Example 2: Sort/Filter Dropdown

```tsx
<Dropdown
  trigger={(isOpen) => (
    <DropdownTrigger isOpen={isOpen}>
      Sort: {currentSort}
    </DropdownTrigger>
  )}
  align="left"
  width="w-64"
>
  <DropdownSection title="Sort By">
    <DropdownItem onClick={() => setSort('newest')} active={currentSort === 'newest'}>
      Newest First
    </DropdownItem>
    <DropdownItem onClick={() => setSort('price_asc')} active={currentSort === 'price_asc'}>
      Price: Low to High
    </DropdownItem>
    <DropdownItem onClick={() => setSort('price_desc')} active={currentSort === 'price_desc'}>
      Price: High to Low
    </DropdownItem>
  </DropdownSection>
</Dropdown>
```

### Example 3: Country/Region Selector

```tsx
const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
];

<Dropdown
  trigger={
    <DropdownTrigger>
      {selectedCountry.flag} {selectedCountry.name}
    </DropdownTrigger>
  }
>
  <DropdownSection title="Select Country">
    {countries.map((country) => (
      <DropdownItem
        key={country.code}
        onClick={() => setSelectedCountry(country)}
        active={selectedCountry.code === country.code}
        icon={<span className="text-2xl">{country.flag}</span>}
      >
        {country.name}
      </DropdownItem>
    ))}
  </DropdownSection>
</Dropdown>
```

---

## 🔧 Integration Checklist

To apply this dropdown style throughout the website:

### ✅ **Already Updated:**
- [x] Language/Currency selector in header
- [x] Filter dropdowns in vendors pages
- [x] Category pages filter dropdowns

### 🔄 **Can Be Updated:**
- [ ] Admin dashboard filters
- [ ] User account dropdowns
- [ ] Sort/filter menus
- [ ] Settings panels
- [ ] Form select fields
- [ ] Navigation menus

---

## 🎯 Best Practices

1. **Use DropdownTrigger** for consistent button styling
2. **Group related items** in DropdownSection with titles
3. **Use DropdownDivider** to separate logical groups
4. **Add icons** to improve visual hierarchy
5. **Show active state** for selected items
6. **Use rightContent** for secondary info (prices, symbols, etc.)
7. **Keep dropdown width** appropriate for content (w-64 to w-96)
8. **Align dropdowns** based on position in layout

---

## 🚀 Advanced Usage

### Custom Trigger

```tsx
<Dropdown
  trigger={(isOpen) => (
    <button className={`custom-class ${isOpen ? 'active' : ''}`}>
      Custom Trigger
    </button>
  )}
>
  {/* content */}
</Dropdown>
```

### With State Management

```tsx
const [selectedValue, setSelectedValue] = useState('option1');

<Dropdown trigger={<DropdownTrigger>{selectedValue}</DropdownTrigger>}>
  <DropdownSection>
    {options.map((option) => (
      <DropdownItem
        key={option.id}
        onClick={() => setSelectedValue(option.value)}
        active={selectedValue === option.value}
      >
        {option.label}
      </DropdownItem>
    ))}
  </DropdownSection>
</Dropdown>
```

---

## 📱 Responsive Behavior

The dropdown components are designed to work on all screen sizes:
- Auto-closes on click outside
- Closes on Escape key press
- Uses fixed backdrop for mobile
- Proper z-index layering
- Smooth animations

---

## 🎨 Customization

You can customize the dropdown appearance by:
1. Passing custom `className` props
2. Adjusting the `width` parameter
3. Using `noPadding` on sections for custom layouts
4. Styling the trigger button separately

---

For more information, check the component source files:
- `/src/components/ui/Dropdown.tsx`
- `/src/components/ui/LanguageDropdown.tsx`

