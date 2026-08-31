export default function Card({ children, className = "" }) {
  return (
    <div className={`border border-black/10 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}
