import { Checkbox, Collapse } from "antd";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdClose,
} from "react-icons/md";
import FilterValues from "./FilterValues";
import { useDispatch } from "react-redux";

export default function Filters({ possibleTraitTypes }) {
  const dispatch = useDispatch();

  return (
    <section className="w-[280px]">
      <div className="border border-solid border-t-0 border-l-0 border-r-0 rounded-none border-[#CFDBD599] flex justify-between items-center px-1 pt-2 pb-4">
        <p className="font-extrabold text-xl">Filters</p>
        <span
          onClick={() => {
            // setFiltersOpen(false);
            dispatch({ type: "collection/setIsFiltersOpen", payload: false });
          }}
        >
          <MdClose className="h-4 w-4 cursor-pointer mr-3" />
        </span>
      </div>

      <FilterValues possibleTraitTypes={possibleTraitTypes} />
    </section>
  );
}
