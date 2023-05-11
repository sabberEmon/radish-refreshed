import { Button, Drawer } from "antd";
import { useEffect, useState } from "react";
import { BsFilter } from "react-icons/bs";
import { MdOutlineSearch } from "react-icons/md";
import CollectionListNfts from "./CollectionListNfts";
import Filters from "./Filters";
import Select from "../utils/Select";
import FilterValues from "./FilterValues";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

function CollectionMain({ possibleTraitTypes, collectionIdentifier }) {
  const collection = useSelector((state) => state.main.collection);
  const dispatch = useDispatch();
  const {
    ref: infinityRef,
    inView,
    entry,
  } = useInView({
    rootMargin: "0px 0px 100px 0px",
  });

  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOne, setSortOne] = useState({
    label: "Price high to low",
    value: "priceHighToLow",
  });
  const [sortTwo, setSortTwo] = useState({
    label: "Available to buy",
    value: "availableToBuy",
  });

  const fetchMoreData = async (page, filters) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/nfts/with-filters?page=${page}`,
      {
        filters,
        primaryFilters: {
          collectionIdentifier: collectionIdentifier,
          // price not equal to null in mongoose
          price: { $ne: null },
        },
        sortBy: {
          price: -1,
        },
      }
    );

    // console.log(res.data);
    dispatch({
      type: "collection/apendNfts",
      payload: res.data?.nfts,
    });
    setLoading(false);
  };

  useEffect(() => {
    if (inView) {
      dispatch({
        type: "collection/incrementPage",
      });
    }
  }, [inView]);

  // call fetchMoreData() when collection.page or collection.filters change
  useEffect(() => {
    fetchMoreData(collection.page, collection.filters);
  }, [collection.page, collection.filters]);

  return (
    <section className="xl:px-20 px-4 mt-10">
      <div className="md:flex items-center gap-x-3 max-w-[1280px]">
        <div className="flex w-full gap-x-3">
          <Button
            className="md:flex justify-center items-center hidden"
            shape="circle"
            icon={<BsFilter className="h-5 w-5" />}
            type={collection.isFiltersOpen ? "primary" : "default"}
            size="large"
            onClick={() => {
              dispatch({
                type: "collection/setIsFiltersOpen",
                payload: !collection.isFiltersOpen,
              });
            }}
          />

          {/* mobile filter btn */}
          <Button
            className="flex justify-center items-center md:hidden"
            shape="circle"
            icon={<BsFilter className="h-5 w-5" />}
            type={mobileFiltersOpen ? "primary" : "default"}
            size="large"
            onClick={() => {
              setMobileFiltersOpen((prev) => !prev);
            }}
          />

          <div className="flex xl:w-[420px] w-full h-[40px] items-center px-5 bg-[#ebf0f080] dark:bg-[#49606066] rounded-[8px]">
            <MdOutlineSearch className="w-5 h-5 text-secondaryGray dark:text-secondaryDarkGray" />
            <input
              placeholder="Search collections"
              className="flex flex-grow border-none outline-none h-full placeholder:font-normal px-2 font-normal"
              style={{
                backgroundColor: "transparent",
              }}
              value={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const userSearch = e.target.value;
                  let actualSearch;
                  if (userSearch.includes("#")) {
                    actualSearch = userSearch.replace("#", "hashtag");
                  } else {
                    actualSearch = userSearch;
                  }
                  setSearch(actualSearch);
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-x-3 w-full mt-3 md:mt-0">
          <Select
            options={[
              { label: "Price high to low", value: "priceHighToLow" },
              { label: "Price low to high", value: "priceLowToHigh" },
              { label: "Rank high to low", value: "rankHighToLow" },
              { label: "Rank low to high", value: "rankLowToHigh" },
            ]}
            value={sortOne}
            onChange={(option) => {
              setSortOne(option);
            }}
          />

          <Select
            options={[
              { label: "Available to buy", value: "availableToBuy" },
              { label: "On auction", value: "onAuction" },
              { label: "On sale", value: "onSale" },
            ]}
            value={sortTwo}
            onChange={(option) => {
              setSortTwo(option);
            }}
          />
        </div>
      </div>

      <div className="mt-10 min-h-[50vh] md:flex md:gap-x-6">
        {/* filters */}
        {collection.isFiltersOpen && (
          <Filters possibleTraitTypes={possibleTraitTypes} />
        )}
        <CollectionListNfts
          infinityRef={infinityRef}
          loading={loading && collection.page === 1}
        />
        {/* <div ref={infinityRef}></div> */}
      </div>

      {/* mobile filters drawer */}
      <Drawer
        placement="bottom"
        onClose={() => {
          setMobileFiltersOpen(false);
        }}
        open={mobileFiltersOpen}
        height="80vh"
        closable={true}
        title={<p>Filters</p>}
        // className="rounded-t-[24px]"
      >
        <FilterValues possibleTraitTypes={possibleTraitTypes} />
      </Drawer>
    </section>
  );
}

export default CollectionMain;
