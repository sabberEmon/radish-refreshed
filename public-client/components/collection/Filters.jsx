import { Checkbox, Collapse } from "antd";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdClose,
} from "react-icons/md";
import FilterValues from "./FilterValues";

export default function Filters({
  setFiltersOpen,
  possibleTraitTypes,
  filters,
  setFilters,
}) {
  return (
    <section className="w-[280px]">
      <div className="border border-solid border-t-0 border-l-0 border-r-0 rounded-none border-[#CFDBD599] flex justify-between items-center px-1 pt-2 pb-4">
        <p className="font-extrabold text-xl">Filters</p>
        <span
          onClick={() => {
            setFiltersOpen(false);
          }}
        >
          <MdClose className="h-4 w-4 cursor-pointer mr-3" />
        </span>
      </div>

      <FilterValues
        possibleTraitTypes={possibleTraitTypes}
        filters={filters}
        setFilters={setFilters}
      />
    </section>
  );
}
