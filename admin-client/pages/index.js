import Navbar from "@/components/Navbar";
import { useModifyJsonDataFileMutation } from "@/redux/features/api/apiSlice";
import { Button, Input, Table, message } from "antd";
import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

// fileReader
async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}

export default function Home({ subscribers }) {
  const [json, setJson] = useState(null);
  const [collectionIdentifier, setCollectionIdentifier] = useState(null);
  const [modifyJsonDataFile, { isLoading }] = useModifyJsonDataFileMutation();

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span>
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      ),
    },
  ];

  const handleJsonUpload = async (e) => {
    const file = e.target.files[0];
    const json = await parseJsonFile(file);
    // console.log(json);
    setJson(json);
  };

  const handleModifyJsonData = async () => {
    if (!collectionIdentifier || !json) {
      message.error("Please insert collection identifier and json data");
      return;
    }

    modifyJsonDataFile({
      collectionIdentifier,
      data: json,
    }).then((res) => {
      console.log(res);
      if (res.data.success) {
        message.success("Json data added successfully");
        setJson(null);
        // redirect to a new window url
        window.open(res.data.url, "_blank");
      } else {
        message.error("Error adding json data");
      }
    });
  };

  return (
    <>
      <Head>
        <title>Radish Admin</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <section className="my-8">
          <h2 className="text-center my-4">Modify Json Data</h2>
          <div className="w-fit mx-auto flex items-center">
            <Input type="file" className="w-60" onChange={handleJsonUpload} />
            <Input
              type="text"
              className="w-60 ml-3"
              placeholder="Enter collection identifier"
              value={collectionIdentifier}
              onChange={(e) => setCollectionIdentifier(e.target.value.trim())}
            />
            <Button
              className="ml-6"
              type="primary"
              loading={isLoading}
              onClick={handleModifyJsonData}
            >
              Start
            </Button>
          </div>
        </section>
        <section className="my-6">
          <h2 className="text-center my-4">Subscribers List</h2>
          <Table columns={columns} dataSource={subscribers} />
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const response = await axios.get(
    `${process.env.API_BASE_URL}/api/user/get-subscribers`
  );

  // console.log(response.data);

  // console.log("session", session);

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
      subscribers: response.data.subscribers,
    },
  };
}
