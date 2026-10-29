/** Interruptor encendido/apagado, con zona táctil de 60×44. */
export function Switch({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={label}
      className="flex h-11 w-[60px] flex-none items-center justify-center border-none bg-transparent p-0"
    >
      <span className="relative block h-[30px] w-[50px] rounded-[15px] transition-colors" style={{ background: on ? "#7C8A48" : "#D8CDBE" }}>
        <span
          className="absolute top-[3px] size-6 rounded-full bg-paper shadow-[0_1px_3px_rgba(78,52,36,0.3)] transition-[left]"
          style={{ left: on ? 23 : 3 }}
        />
      </span>
    </button>
  );
}
