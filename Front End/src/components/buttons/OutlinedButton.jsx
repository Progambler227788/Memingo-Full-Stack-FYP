import clsx from "clsx";

/**
 * Outlined brand button (e.g., for "Reset")
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.fontFamily]
 * @param {boolean} [props.disabled]
 * @param {function} [props.onClick]
 * @param {React.ReactNode} [props.icon] // Left icon
 * @param {object} [props.style]
 */
export default function OutlinedButton({
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
        "inline-flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-colors shadow-lg",
        "border-2 bg-white",
        "hover:opacity-90 focus:outline-none focus:ring-2",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      style={{
        borderColor: logoColor,
        color: logoColor,
        fontFamily,
        minHeight: "48px",
        height: "48px",
        backgroundColor: "white",
        ...style,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = `${logoColor}1A`; // ~10% opacity
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "white";
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
