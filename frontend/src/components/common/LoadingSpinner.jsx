export default function LoadingSpinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4 border', md: 'w-7 h-7 border-2', lg: 'w-10 h-10 border-2' }[size];
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${s} rounded-full border-ui-border border-t-accent animate-spin`} />
    </div>
  );
}
