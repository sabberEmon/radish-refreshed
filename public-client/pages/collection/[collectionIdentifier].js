import Container from "@/components/layouts/Container";
import Head from "next/head";
import currencyIcon from "../../images/currency-icon.png";
import Image from "next/image";
import WalletNumber from "@/components/utils/WalletNumber";
import { abbreviateNumber } from "@/lib/utils";
import { IoShuffle } from "react-icons/io5";
import { Button } from "antd";
import { MdOutlineShare } from "react-icons/md";
import CollectionMain from "@/components/collection/CollectionMain";
import axios from "axios";
import { useRouter } from "next/router";

export default function Collection({ collection }) {
  // console.log(collection);
  const router = useRouter();

  const { collectionIdentifier } = router.query;

  // console.log(collectionIdentifier);

  return (
    <>
      <Head>
        <title>{collection?.title} | Radish Square</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <section>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={collection?.collectionBanner}
              className="w-full h-[360px] object-cover"
              alt="banner"
            />

            {/* collection Card */}
            <div className="relative -mt-16 xl:px-20 px-4 flex justify-between max-w-[1800px] mx-auto">
              <div>
                <div className="flex justify-start">
                  <div className="w-[112px] h-[112px] rounded-full border-4 border-white border-solid flex justify-center items-center">
                    <Image
                      src={collection?.collectionProfilePicture}
                      className="rounded-full"
                      alt="profile"
                      width={108}
                      height={108}
                    />
                  </div>
                </div>
                <div className="max-w-[508px]">
                  <h2 className="font-extrabold text-[40px] mt-2">
                    {collection?.title}
                  </h2>

                  <p className="text-[#94999D] font-bold mt-2">
                    By{" "}
                    <span className="text-primary">
                      @{collection?.creator?.name}
                    </span>
                  </p>

                  <div className="flex items-center gap-x-3 text-sm mt-4">
                    <p>
                      <span className="font-bold">Mint: </span>
                      <span className="text-[#979797] capitalize">
                        {collection?.buyType}
                      </span>
                    </p>

                    <p>
                      <span className="font-bold">Trading: </span>
                      <span className="text-[#979797]">Enabled</span>
                    </p>

                    <p>
                      <span className="font-bold">Total trading fee: </span>
                      <span className="text-[#979797]">10%</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2 mt-3">
                  <div className="text-sm font-extrabold -mt-[2px]">
                    Collection address:
                  </div>
                  <div>
                    <WalletNumber
                      style="text-sm text-primary font-semibold !m-0 !p-0"
                      walletNumber={collection?.collectionWallet}
                    />
                  </div>
                </div>
                <div className="max-w-[508px] text-[#94999D] mt-3">
                  {collection?.description}
                </div>
                <div className="flex items-center gap-x-8  my-6">
                  <div className="text-left">
                    <p className="font-extrabold text-xl">
                      {abbreviateNumber(collection?.nftCount)}
                    </p>
                    <p className="mt-1 text-sm text-secondaryGray font-bold">
                      items
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="font-extrabold text-xl">
                      {abbreviateNumber(collection?.ownerCount)}
                    </p>
                    <p className="mt-1 text-sm text-secondaryGray font-bold">
                      owners
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-center">
                      <div className="inline-flex items-center">
                        <Image
                          src={currencyIcon}
                          width={20}
                          height={20}
                          alt="Currency"
                          className="mr-1"
                        />
                        <span className="font-extrabold">
                          {abbreviateNumber(collection?.floorPrice)}
                        </span>
                      </div>
                    </div>
                    <span className="text-secondaryGray text-sm font-bold mt-1">
                      floor price
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="text-center">
                      <div className="inline-flex items-center">
                        <Image
                          src={currencyIcon}
                          width={20}
                          height={20}
                          alt="Currency"
                          className="mr-1"
                        />
                        <span className="font-extrabold">
                          {abbreviateNumber(collection?.volume)}
                        </span>
                      </div>
                    </div>
                    <span className="text-secondaryGray text-sm font-bold mt-1">
                      volume
                    </span>
                  </div>
                </div>

                <div className="w-full mt-8 flex items-center justify-start gap-x-2">
                  <Button className="flex items-center justify-center  font-extrabold w-[170px] h-[46px] rounded-[12px]">
                    <IoShuffle className="h-6 w-6 mr-2" />
                    Random Buy
                  </Button>

                  <Button className="w-[46px] h-[46px] rounded-[23px] flex justify-center items-center">
                    <MdOutlineShare className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-[1800px] mx-auto mb-8">
            <CollectionMain
              possibleTraitTypes={collection.possibleTraitTypes}
              collectionIdentifier={collectionIdentifier}
            />
          </div>
        </main>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const { collectionIdentifier } = context.query;

  try {
    let response = await axios.get(
      `${process.env.API_BASE_URL}/api/collection/${collectionIdentifier}`,
      {}
    );

    return {
      props: {
        collection: response.data?.collection,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        collection: null,
      },
    };
  }
}
