import clsx from "clsx";

/**
 * OptionChipButton - For MCQ/fill-in-blank options, styled as chips.
 */
export default function OptionChipButton({
  children,
  selected,
  disabled,
  fontFamily,
  onClick,
  logoColor = "#256470",
  style,
  ...rest
}) {
  const defaultBg = selected ? logoColor : "white";
  const defaultText = selected ? "white" : logoColor;
  const defaultBorder = logoColor;
  const hoverBg = !selected ? `${logoColor}1A` : logoColor; // ~10% opacity
  const hoverText = logoColor;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-2xl border-2 transition-all shadow-sm font-semibold text-base min-w-[44px] px-5 py-2",
        disabled && "opacity-60 pointer-events-none"
      )}
      style={{
        backgroundColor: defaultBg,
        color: defaultText,
        borderColor: defaultBorder,
        fontFamily,
        ...style,
      }}
      onMouseOver={(e) => {
        if (!selected && !disabled) {
          e.currentTarget.style.backgroundColor = hoverBg;
          e.currentTarget.style.color = hoverText;
          e.currentTarget.style.borderColor = logoColor;
        }
      }}
      onMouseOut={(e) => {
        if (!selected && !disabled) {
          e.currentTarget.style.backgroundColor = "white";
          e.currentTarget.style.color = logoColor;
          e.currentTarget.style.borderColor = logoColor;
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
