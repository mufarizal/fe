export default function Button({
  children,
  variant = "solid",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  const base =
    "px-5 py-2 text-sm font-medium tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    solid: "bg-black text-white hover:bg-gray-800",
    outline: "border border-black text-black hover:bg-black hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
