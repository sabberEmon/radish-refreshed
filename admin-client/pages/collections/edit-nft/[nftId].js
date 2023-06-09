import Navbar from "@/components/Navbar";
import { Button, Checkbox, Input, message } from "antd";
import { getSession } from "next-auth/react";
import Head from "next/head";
import axios from "axios";
import { useEditNftMutation } from "@/redux/features/api/apiSlice";
import { useRouter } from "next/router";

export default function Collections({ nft }) {
  const [editNft, { isLoading }] = useEditNftMutation();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    for (let [key, value] of new FormData(e.target)) {
      if (key === "price") value = Number(value);
      data[key] = value;
    }
    editNft({ nftId: nft._id, ...data }).then((res) => {
      if (res.error) return console.log(res.error);
      message.success("Nft edited successfully");
      //   router.push("/collections");
    });
  };

  return (
    <>
      <Head>
        <title>Radish Admin / Nfts</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <section className="my-6">
          <h2 className="text-xl font-bold text-center">
            Edit Nft <span className="text-primary">"{nft?.referenceId}"</span>{" "}
            of Collection{" "}
            <span className="text-primary">"{nft?.collectionIdentifier}"</span>
          </h2>
        </section>
        <section className="mt-8 px-6">
          <form className="max-w-xl mx-auto space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder=""
                defaultValue={nft?.title}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="title">Owner Wallet</label>
              <Input
                id="ownerWallet"
                type="text"
                name="ownerWallet"
                placeholder=""
                defaultValue={nft?.ownerWallet}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="currency">Currency</label>
              <Input
                id="currency"
                type="text"
                name="currency"
                placeholder=""
                defaultValue={nft?.currency}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="price">Price</label>
              <Input
                id="price"
                type="number"
                name="price"
                placeholder=""
                defaultValue={nft?.price}
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="!mt-10 w-full"
              size="large"
              loading={isLoading}
            >
              Save
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { nftId } = context.query;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const response = await axios.get(
    `${process.env.API_BASE_URL}/api/nfts/nft/${nftId}`
  );

  //   console.log(response.data);

  return {
    props: {
      session,
      nft: response.data.nft,
      collection: response.data.collection,
    },
  };
}
