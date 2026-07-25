import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

function SmartDropdown({ trigger, children, width = 180, offset = 8 }) {
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState("bottom");

  useLayoutEffect(() => {
    if (!isOpen) return;

    const calculatePosition = () => {
      if (!triggerRef.current || !dropdownRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();

      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - triggerRect.bottom;

      const spaceAbove = triggerRect.top;

      if (
        spaceBelow < dropdownRect.height &&
        spaceAbove > dropdownRect.height
      ) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
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

      setIsOpen(false);
    };

    const esc = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={() => setIsOpen((prev) => !prev)}>
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
              placement === "top" ? "bottom center" : "top center",
          }}
          className={`
            absolute
            left-0
            z-50
           overflow-auto
            max-h-72
            rounded-3xl
            border
            border-gray-200
            dark:border-[#2A3A52]
            bg-white
            dark:bg-[#1A2438]
            shadow-2xl
            animate-dropdown
            ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"}
          `}
        >
          {children({ close: () => setIsOpen(false) })}
        </div>
      )}
    </div>
  );
}

export default SmartDropdown;
