import { classNames } from '../lib/classNames'

export function ChoiceGroup({ title, field, value, items, onChange }) {
  return (
    <div className="panel choice-panel">
      <h2>{title}</h2>
      <div className="chips">
        {items.map((item) => {
          const itemValue = Array.isArray(item) ? item[0] : item
          const label = Array.isArray(item) ? item[1] : item

          return (
            <button
              className={classNames(value === itemValue && 'selected')}
              key={itemValue}
              onClick={() => onChange((current) => ({ ...current, [field]: itemValue }))}
              type="button"
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function MultiChoice({ title, selected, items, onToggle }) {
  return (
    <div className="panel choice-panel">
      <h2>{title}</h2>
      <div className="chips">
        {items.map((item) => (
          <button
            className={classNames(selected.includes(item) && 'selected')}
            key={item}
            onClick={() => onToggle(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
