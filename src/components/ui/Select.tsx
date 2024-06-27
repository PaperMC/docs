import {
  autoUpdate,
  size,
  flip,
  useDismiss,
  useFloating,
  useClick,
  useInteractions,
  useListNavigation,
  useRole,
  FloatingFocusManager,
  FloatingPortal,
  useTypeahead,
} from "@floating-ui/react";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Button({ options, value, onSelect }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    value && options.indexOf(value),
  );

  useEffect(() => {
    if (value) {
      setSelectedIndex(options.indexOf(value));
    }
  }, [value]);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const listContentRef = useRef(options.map((option) => option.label));
  const isTypingRef = useRef(false);

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: listContentRef,
    activeIndex,
    selectedIndex,
    onMatch: open ? setActiveIndex : setSelectedIndex,
    onTypingChange(isTyping) {
      isTypingRef.current = isTyping;
    },
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    dismiss,
    role,
    listNav,
    typeahead,
    click,
  ]);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    setOpen(false);
    onSelect(options[index]);
  }

  return (
    <div className="custom-dropdown">
      <div
        {...getReferenceProps({
          ref: refs.setReference,
          "aria-autocomplete": "none",
          className: "custom-dropdown__value",
          tabIndex: 0,
        })}
      >
        {selectedIndex != null ? options[selectedIndex].label : "Select..."}
      </div>

      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                className: "custom-dropdown__content",
                style: {
                  ...floatingStyles,
                },
              })}
            >
              {options.map((option, index) => (
                <div
                  {...getItemProps({
                    className: clsx(
                      "custom-dropdown__item",
                      activeIndex === index && "custom-dropdown__item--selected",
                    ),
                    key: option.value,
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      handleSelect(index);
                    },
                    onKeyDown(event) {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSelect(index);
                      }

                      if (event.key === " " && !isTypingRef.current) {
                        event.preventDefault();
                        handleSelect(index);
                      }
                    },
                    role: "option",
                    tabIndex: index === activeIndex ? 0 : -1,
                    "aria-selected": index === selectedIndex && index === activeIndex,
                    active: activeIndex === index,
                  })}
                >
                  <div className="custom-dropdown__item-label">{option.label}</div>
                  {option.description && (
                    <div className="custom-dropdown__item-description">{option.description}</div>
                  )}
                </div>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
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
