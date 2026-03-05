import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    danger:    'btn-danger',
    ghost:     'hover:bg-slate-100 text-slate-600 font-medium px-4 py-2 rounded-xl transition-colors',
  };
  const sizes = {
    sm: 'text-sm px-3 py-2',
    md: '',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}