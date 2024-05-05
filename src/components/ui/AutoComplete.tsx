import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  autoUpdate,
  size,
  flip,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  FloatingFocusManager,
  FloatingPortal,
} from "@floating-ui/react";
import React from "react";
import clsx from "clsx";

export default function AutoComplete({ options, value, onSelect, placeholder }: AutoCompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.value);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    setInputValue(value?.value);
  }, [value]);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    role,
    dismiss,
    listNav,
  ]);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
      setActiveIndex(0);
    } else {
      setOpen(false);
    }
  }

  const items = options.filter(
    (item) =>
      item.value.toLowerCase().startsWith(inputValue?.toLowerCase()) ||
      item.label?.toLowerCase()?.startsWith?.(inputValue?.toLowerCase())
  );

  return (
    <>
      <input
        {...getReferenceProps({
          ref: refs.setReference,
          onChange,
          value: inputValue,
          placeholder,
          className: "autocomplete",
          type: "text",
          "aria-autocomplete": "list",
          onKeyDown(event) {
            if (event.key === "Enter" && activeIndex != null && items[activeIndex]) {
              setInputValue(items[activeIndex].value);
              onSelect(items[activeIndex]);
              setActiveIndex(null);
              setOpen(false);
            }
          },
        })}
      />
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                className: "autocomplete-portal",
                style: {
                  ...floatingStyles,
                },
              })}
            >
              {items.map((item, index) => (
                <div
                  {...getItemProps({
                    className: clsx(
                      "autocomplete-portal__item",
                      activeIndex === index && "autocomplete-portal__item--selected"
                    ),
                    key: item.value,
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      setInputValue(item.value);
                      onSelect(item);
                      setOpen(false);
                      refs.domReference.current?.focus();
                    },
                    active: activeIndex === index,
                  })}
                >
                  <div className="autocomplete-portal__item-label">{item.label}</div>
                  {item.description && (
                    <div className="custom-dropdown-portal__item-description">
                      {item.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}

interface AutoCompleteProps {
  options: Option[];
  value?: Option;
  placeholder?: string;
  onSelect: (option: Option) => void;
}

export interface Option {
  label: string;
  value: string;
  description?: string;
}
