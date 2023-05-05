import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

function Select({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectContainerRef = useRef();

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // when clicked outside of the select, close the dropdown
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        isOpen &&
        selectContainerRef.current &&
        !selectContainerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative xl:w-[420px] w-full" ref={selectContainerRef}>
      <button
        type="button"
        className="flex w-full items-center justify-between h-[40px] text-sm bg-white p-2 px-4 outline-none border-none bg-[#ebf0f080] dark:bg-[#49606066] rounded-[8px] cursor-pointer text-[#979797]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value.label}</span>
        <span className="text-xl w-4 h-4 grid place-content-center text-[#979797]">
          <MdKeyboardArrowDown />
        </span>
      </button>

      {isOpen && (
        <ul className="z-10 absolute mt-2 w-full rounded-[8px] bg-gray-50 dark:bg-secondaryBlack list-none text-[#979797]">
          {options.map((option) => (
            <li
              key={option.value}
              className="cursor-pointer select-none p-2 hover:bg-gray-200 dark:hover:bg-secondaryDarkGray dark:hover:text-white text-[#979797] text-sm last:rounded-b-[8px] first:rounded-t-[8px]"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
