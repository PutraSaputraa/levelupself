export function Field({ label, name, placeholder, type = 'text', value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
    </label>
  )
}
