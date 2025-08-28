import clsx from "clsx";

/**
 * TileButton - Button for draggable/rearrangeable tiles
 * @param {object} props
 * @param {string} props.children
 * @param {boolean} [props.selected]
 * @param {boolean} [props.disabled]
 * @param {string} [props.fontFamily]
 * @param {function} [props.onClick]
 * @param {string} [props.logoColor] - Brand color, defaults to #256470
 * @param {object} [props.style]
 */
export default function TileButton({
  children,
  selected,
  disabled,
  fontFamily,
  onClick,
  logoColor = "#256470",
  style,
  ...rest
}) {
  // Generate hover background dynamically
  const hoverBg = `${logoColor}33`; // ~20% opacity (hex alpha)
  const selectedBg = `${logoColor}33`;
  const borderColor = selected ? logoColor : `${logoColor}80`; // 80 ~ 50% opacity
  const ring = selected ? logoColor : "transparent";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "px-5 py-2 rounded-xl font-medium shadow-sm transition-all select-none focus:outline-none",
        disabled && "opacity-60 pointer-events-none"
      )}
      style={{
        backgroundColor: selected ? selectedBg : "white",
        color: logoColor,
        border: `1px solid ${borderColor}`,
        boxShadow: selected ? `0 0 0 2px ${ring}` : undefined,
        fontFamily,
        minWidth: 44,
        ...style,
      }}
      onMouseOver={(e) => {
        if (!selected && !disabled) {
          e.currentTarget.style.backgroundColor = hoverBg;
        }
      }}
      onMouseOut={(e) => {
        if (!selected && !disabled) {
          e.currentTarget.style.backgroundColor = "white";
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
