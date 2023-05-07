import { Button, Drawer } from "antd";
import { useState } from "react";
import { BsFilter } from "react-icons/bs";
import { MdOutlineSearch } from "react-icons/md";
import CollectionListNfts from "./CollectionListNfts";
import Filters from "./Filters";
import Select from "../utils/Select";
import FilterValues from "./FilterValues";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import SingleNft from "../common/SingleNft";

function CollectionMain({ possibleTraitTypes, collectionIdentifier }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  const [nfts, setNfts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(null);
  const [count, setCount] = useState(null);

  const fetchMoreData = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/nft/with-filters?page=${page}`,
      {
        filters: filters,
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
    // merge new nfts with old nfts
    setNfts((prev) => [...prev, ...res.data?.nfts]);
    setHasMore(res.data?.hasMore);
    setCount(res.data?.count);
    setPage((prev) => prev + 1);
  };

  fetchMoreData();

  return (
    <section className="xl:px-20 px-4 mt-10">
      <div className="md:flex items-center gap-x-3 max-w-[1280px]">
        <div className="flex w-full gap-x-3">
          <Button
            className="md:flex justify-center items-center hidden"
            shape="circle"
            icon={<BsFilter className="h-5 w-5" />}
            type={filtersOpen ? "primary" : "default"}
            size="large"
            onClick={() => {
              setFiltersOpen((prev) => !prev);
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
        {filtersOpen && (
          <Filters
            setFiltersOpen={setFiltersOpen}
            possibleTraitTypes={possibleTraitTypes}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        {/* <CollectionListNfts
          nfts={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]}
          filtersOpen={filtersOpen}
        /> */}

        {/* <InfiniteScroll
          dataLength={count} //This is important field to render the next data
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          // below props only if you need pull down functionality
          // refreshFunction={this.refresh}
          // pullDownToRefresh
          // pullDownToRefreshThreshold={50}
          // pullDownToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>
          //     &#8595; Pull down to refresh
          //   </h3>
          // }
          // releaseToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          // }
        >
          {nfts?.map((nft) => (
            <div key={nft} className="w-full justify-center items-center flex">
              <SingleNft />
            </div>
          ))}
        </InfiniteScroll> */}
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
        <FilterValues
          possibleTraitTypes={possibleTraitTypes}
          filters={filters}
          setFilters={setFilters}
        />
      </Drawer>
    </section>
  );
}

export default CollectionMain;
