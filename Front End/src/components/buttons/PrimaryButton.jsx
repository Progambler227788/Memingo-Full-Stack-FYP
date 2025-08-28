import clsx from "clsx";

/**
 * Filled brand button (e.g., for "Check")
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.fontFamily]
 * @param {boolean} [props.disabled]
 * @param {function} [props.onClick]
 * @param {React.ReactNode} [props.icon] // Left icon
 * @param {object} [props.style]
 */
export default function PrimaryButton({
  children,
  className,
  fontFamily,
  disabled,
  onClick,
  icon,
  style,
  ...rest
}) {
  const logoColor = "#256470";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-colors text-white shadow-lg",
        "focus:outline-none focus:ring-2",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      style={{
        backgroundColor: logoColor,
        borderColor: logoColor,
        fontFamily,
        minHeight: "48px",
        height: "48px",
        ...style,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#1E4E58"; // Slightly darker shade
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = logoColor;
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
