import { Checkbox, Collapse } from "antd";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export default function FilterValues({
  possibleTraitTypes,
  filters,
  setFilters,
}) {
  return (
    <>
      {possibleTraitTypes?.map((traitType, index) => {
        return (
          <Collapse
            bordered={false}
            key={index}
            onChange={(key) => {}}
            expandIconPosition="end"
            expandIcon={({ isActive }) =>
              isActive ? (
                <MdKeyboardArrowUp className="h-4 w-4 text-[#979797]" />
              ) : (
                <MdKeyboardArrowDown className="h-4 w-4 text-[#979797]" />
              )
            }
            className="bg-transparent text-[15px] border border-solid border-t-0 border-l-0 border-r-0 rounded-none border-[#CFDBD599] mt-3"
          >
            <Collapse.Panel
              header={
                <p className="font-bold text-base capitalize -ml-3">
                  {traitType.trait_type}
                </p>
              }
              key={index}
              className="!p-0 !m-0"
            >
              <div className="space-y-1">
                {traitType.values.map((trait) => {
                  return (
                    <div
                      key={trait}
                      className="flex justify-between items-center !w-full"
                    >
                      <p className="capitalize text-[#5D5D5B]">{trait}</p>
                      <Checkbox
                        value={trait}
                        checked={filters
                          .find(
                            (filter) =>
                              filter.trait_type === traitType.trait_type
                          )
                          ?.values.includes(trait)}
                        onChange={(e) => {
                          const tempFilters = [...filters];

                          const { value } = e.target;
                          // console.log(value);
                          const targetedFilter = tempFilters.find(
                            (filter) =>
                              filter.trait_type === traitType.trait_type
                          );

                          if (targetedFilter) {
                            if (targetedFilter.values.includes(value)) {
                              targetedFilter.values =
                                targetedFilter.values.filter(
                                  (val) => val !== value
                                );
                            } else {
                              targetedFilter.values.push(value);
                            }
                          } else {
                            tempFilters.push({
                              trait_type: traitType.trait_type,
                              values: [value],
                            });
                          }

                          // remove empty filters
                          tempFilters.forEach((filter, index) => {
                            if (filter.values.length === 0) {
                              tempFilters.splice(index, 1);
                            }
                          });

                          setFilters(tempFilters);
                          // console.log(tempFilters);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </Collapse.Panel>
          </Collapse>
        );
      })}
    </>
  );
}
