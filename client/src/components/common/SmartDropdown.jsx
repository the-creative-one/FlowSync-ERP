import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

function SmartDropdown({
  trigger,
  children,
  width = 180,
  placement = "auto",
  align = "left",
  fullWidth = false,
  open,
  onOpenChange,
}) {
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (value) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  const [position, setPosition] = useState({
    vertical: "bottom",
    horizontal: "left",
  });

  useLayoutEffect(() => {
    if (!isOpen) return;

    const calculatePosition = () => {
      if (!triggerRef.current || !dropdownRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();

      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      const spaceRight = viewportWidth - triggerRect.right;
      const spaceLeft = triggerRect.left;

      let vertical = "bottom";
      let horizontal = align;

      if (
        placement === "auto" &&
        spaceBelow < dropdownRect.height &&
        spaceAbove > dropdownRect.height
      ) {
        vertical = "top";
      }

      if (align === "left" && spaceRight < dropdownRect.width) {
        horizontal = "right";
      }

      if (align === "right" && spaceLeft < dropdownRect.width) {
        horizontal = "left";
      }

      setPosition({
        vertical,
        horizontal,
      });
    };

    calculatePosition();

    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition, true);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const close = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      )
        return;

      setOpen(false);
    };

    const esc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);

    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <div className={`relative ${fullWidth ? "block w-full" : "inline-block"}`}>
      <div
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!isOpen);
        }}
      >
        {" "}
        {cloneElement(trigger, {
          className: `${trigger.props.className ?? ""} ${
            isOpen ? "dropdown-open" : ""
          }`,
        })}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            width,
            transformOrigin:
              position.vertical === "top" ? "bottom center" : "top center",
          }}
          className={`
            absolute
            left-0
            z-50
           overflow-auto
            max-h-72
            rounded-sm
            border
            border-gray-200
            dark:border-[#2A3A52]
            bg-white
            dark:bg-[#1A2438]
            shadow-2xl
            animate-dropdown
            ${
              position.vertical === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }
            ${position.horizontal === "left" ? "left-0" : "right-0"}
          `}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}

export default SmartDropdown;
