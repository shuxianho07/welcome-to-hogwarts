export default function GlassCard({ className = '', children, ...rest }) {
  return (
    <div
      className={`glass-card interactive-card p-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
