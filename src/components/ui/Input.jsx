export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="label">{label}</label>}
      <input className={`input-field ${error ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="label">{label}</label>}
      <textarea className={`input-field resize-none ${error ? 'border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="label">{label}</label>}
      <select className={`input-field ${error ? 'border-red-400' : ''} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}