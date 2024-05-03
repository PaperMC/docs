import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

const isServerSide = typeof document === "undefined";

export default function Button({ options, value, onSelect }: SelectProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event: { target: EventTarget | null }) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (isServerSide) return;
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="custom-dropdown__value" onClick={() => setOpen(!open)}>
        {value?.label}
      </div>
      {open && (
        <div className="custom-dropdown__content">
          {options.map((option) => (
            <div
              key={option.label}
              className={clsx(
                "custom-dropdown__item",
                option === value && "custom-dropdown__item--selected"
              )}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
            >
              <div className="custom-dropdown__item-label">{option.label}</div>
              {option.description && (
                <div className="custom-dropdown__item-description">{option.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SelectProps {
  options: Option[];
  value?: Option;
  onSelect: (option: Option) => void;
}

export interface Option {
  label: string;
  value: string;
  description?: string;
}
