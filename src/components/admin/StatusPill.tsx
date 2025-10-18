interface StatusPillProps {
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Confirmed' | 'Cancelled' | 'Completed' | 'Failed' | 'Draft' | 'Published';
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'sm' }: StatusPillProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Confirmed':
      case 'Completed':
      case 'Published':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Suspended':
      case 'Cancelled':
      case 'Failed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Inactive':
      case 'Draft':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${getStatusStyles(status)}
      ${size === 'md' ? 'px-3 py-1 text-sm' : ''}
    `}>
      <span className="relative flex h-2 w-2 mr-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
      </span>
      {status}
    </span>
  );
}

