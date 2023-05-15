import Navbar from "@/components/Navbar";
import { Button, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import { useEditCollectionMutation } from "@/redux/features/api/apiSlice";

export default function EditCollection({ collection }) {
  // console.log("collection", collection);
  const [editCollection, { isLoading }] = useEditCollectionMutation();

  const [type, setType] = useState(collection.type || "art");
  const [collectionProfilePicture, setCollectionProfilePicture] = useState(
    collection.collectionProfilePicture || ""
  );
  const [collectionBanner, setCollectionBanner] = useState(
    collection.collectionBanner || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    for (const [key, value] of new FormData(e.target)) {
      if (key === "volume") {
        data[key] = parseInt(value);
        continue;
      }
      data[key] = value;
    }
    data.type = type;
    data.collectionProfilePicture = collectionProfilePicture;
    data.collectionBanner = collectionBanner;
    // console.log(data);
    editCollection({
      collectionIdentifier: collection.collectionIdentifier,
      data,
    }).then((res) => {
      // console.log(res);
      if (res.data?.success) {
        message.success("Collection edited successfully");
      } else {
        message.error("Something went wrong");
      }
    });
  };

  return (
    <>
      <Head>
        <title>Radish Admin / Add Collection</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <h2 className="text-3xl font-bold text-center my-4">Edit Collection</h2>
        <section>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center space-y-5 py-4 px-6 max-w-2xl mx-auto"
          >
            <div className="flex flex-col space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                type="text"
                name="title"
                defaultValue={collection.title}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="collectionWallet">
                Collection Wallet Address
              </label>
              <Input
                id="collectionWallet"
                type="text"
                name="collectionWallet"
                defaultValue={collection?.collectionWallet || ""}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="volume">Initial Volume</label>
              <Input
                id="volume"
                type="number"
                name="volume"
                placeholder=""
                defaultValue={collection.volume}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="royalty">Royalty</label>
              <Input
                id="royalty"
                type="number"
                name="royalty"
                placeholder=""
                defaultValue={collection.royalty}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="maxWalletLimit">Max Wallet Limit</label>
              <Input
                id="maxWalletLimit"
                type="number"
                name="maxWalletLimit"
                placeholder=""
                defaultValue={collection.maxWalletLimit}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="nickname">Nickname</label>
              <Input
                id="nickname"
                type="text"
                name="nickname"
                placeholder=""
                defaultValue={collection.nickname}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="buyType">Buy Type</label>
              <Input
                id="buyType"
                type="text"
                name="buyType"
                placeholder=""
                defaultValue={collection.buyType}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="description">Description</label>
              <Input.TextArea
                id="description"
                type="text"
                name="description"
                defaultValue={collection.description}
                placeholder=""
                rows={4}
              />
            </div>
            <div className="flex justify-between my-3">
              <div className="flex flex-col space-y-2">
                <label htmlFor="collectionProfilePicture">
                  Collection Profile Picture
                </label>
                <Upload
                  name="file"
                  action={`${process.env.NEXT_PUBLIC_RESOURCES_BASE_URL}/action/add-item`}
                  onChange={(info) => {
                    if (info.file.status !== "uploading") {
                      // console.log(info.file, info.fileList);
                    }
                    if (info.file.status === "done") {
                      // console.log(info.file?.response?.url);
                      setCollectionProfilePicture(info.file?.response?.url);
                      message.success(
                        `${info.file.name} file uploaded successfully`
                      );
                    } else if (info.file.status === "error") {
                      message.error(`${info.file.name} file upload failed.`);
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="collectionBanner">Collection Banner</label>
                <Upload
                  name="file"
                  action={`${process.env.NEXT_PUBLIC_RESOURCES_BASE_URL}/action/add-item`}
                  onChange={(info) => {
                    if (info.file.status !== "uploading") {
                      // console.log(info.file, info.fileList);
                    }
                    if (info.file.status === "done") {
                      // console.log(info.file?.response?.url);
                      setCollectionBanner(info.file?.response?.url);
                      message.success(
                        `${info.file.name} file uploaded successfully`
                      );
                    } else if (info.file.status === "error") {
                      message.error(`${info.file.name} file upload failed.`);
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </div>
            </div>
            <div className="flex flex-col space-y-2 mt-3">
              <label htmlFor="type">Collection Type</label>
              <Select
                placeholder="Select collection type"
                value={type}
                onChange={(value) => setType(value)}
                options={[
                  { label: "Art", value: "art" },
                  { label: "Music", value: "music" },
                  { label: "Photography", value: "photography" },
                  { label: "Collectibles", value: "collectibles" },
                ]}
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="!mt-10"
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
  const { collectionIdentifier } = context.query;

  const response = await axios.get(
    `${process.env.API_BASE_URL}/api/collection/${collectionIdentifier}`
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      collection: response.data.collection,
    },
  };
}