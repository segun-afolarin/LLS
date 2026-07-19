const Toggle = ({ checked, onChange, darkMode }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 shrink-0 transition-colors duration-200 ${checked ? "bg-primary" : darkMode ? "bg-white/15" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
};

export default Toggle;