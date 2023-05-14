import { Button, Drawer } from "antd";
import { useEffect, useState } from "react";
import { BsFilter } from "react-icons/bs";
import { MdClose, MdOutlineSearch } from "react-icons/md";
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
  const [tempSearch, setTempSearch] = useState("");
  const [search, setSearch] = useState("");
  const [sortOne, setSortOne] = useState({
    label: "Price high to low",
    value: "priceHighToLow",
  });
  const [sortTwo, setSortTwo] = useState({
    label: "Available to buy",
    value: "availableToBuy",
  });

  console.log(search);

  const fetchMoreData = async (page, filters) => {
    let primaryFilters = {
      collectionIdentifier: collectionIdentifier,
    };

    let sortBy = {};

    if (search) {
      // search in title
      primaryFilters.title = { $regex: search, $options: "i" };
    }

    switch (sortOne.value) {
      case "priceHighToLow":
        sortBy.price = -1;
        break;
      case "priceLowToHigh":
        sortBy.price = 1;
        break;
      case "rankHighToLow":
        sortBy.rank = 1;
        break;
      case "rankLowToHigh":
        sortBy.rank = -1;
        break;

      default:
        break;
    }

    switch (sortTwo.value) {
      case "availableToBuy":
        // primaryFilters.price = { $ne: null };
        // primaryFilters.forSale = true;
        // primaryFilters.onAuction = false;
        // primaryFilters.ownerWallet = "Locked";
        // these should go as mongoose or query, on the server side, primaryFilters are used as ...primaryFilters
        primaryFilters = {
          ...primaryFilters,
          $or: [
            { price: { $ne: null } },
            { forSale: true },
            { onAuction: true },
            { ownerWallet: "Locked" },
          ],
        };

        break;
      case "onAuction":
        primaryFilters.auction = true;
        break;
      case "onSale":
        primaryFilters.forSale = true;
        break;
      case "nonMinted":
        primaryFilters.ownerWallet = "Locked";
        break;
      case "all":
        break;

      default:
        break;
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/nfts/with-filters?page=${page}`,
      {
        filters: search ? [] : filters,
        primaryFilters,
        sortBy,
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

  useEffect(() => {
    // every time collection.filters, sortOne or sortTwo change, reset page to 1
    dispatch({
      type: "collection/setPage",
      payload: 1,
    });
    setLoading(true);
    dispatch({
      type: "collection/setNfts",
      payload: [],
    });
  }, [collection.filters, sortOne, sortTwo, search]);

  // call fetchMoreData() when collection.page or collection.filters change
  useEffect(() => {
    fetchMoreData(collection.page, collection.filters);
  }, [collection.page, collection.filters, sortOne, sortTwo, search]);

  return (
    <section className="xl:px-20 px-4 mt-10">
      <div className="md:flex items-center gap-x-3 max-w-[1280px]">
        <div className="flex w-full gap-x-3">
          <Button
            className="lg:flex justify-center items-center hidden"
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
            className="flex justify-center items-center lg:hidden"
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
              placeholder="Search in collection"
              className="flex flex-grow border-none outline-none h-full placeholder:font-normal px-2 font-normal"
              style={{
                backgroundColor: "transparent",
              }}
              value={tempSearch}
              onChange={(e) => {
                setTempSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // const userSearch = e.target.value;
                  // let actualSearch;
                  // if (userSearch.includes("#")) {
                  //   actualSearch = userSearch.replace("#", "hashtag");
                  // } else {
                  //   actualSearch = userSearch;
                  // }
                  setSearch(tempSearch);
                }
              }}
            />

            {/* cross icon to clear search */}
            {tempSearch && (
              <MdClose
                className="w-4 h-4 text-secondaryGray dark:text-secondaryDarkGray cursor-pointer"
                onClick={() => {
                  setTempSearch("");
                  setSearch("");
                }}
              />
            )}
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
              { label: "Non minted", value: "nonMinted" },
              { label: "All", value: "all" },
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
