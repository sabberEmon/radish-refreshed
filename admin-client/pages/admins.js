import Navbar from "@/components/Navbar";
import { Button, Input, Table, message } from "antd";
import { getSession } from "next-auth/react";
import Head from "next/head";
import axios from "axios";
import { useAddAdminToWhitelistMutation } from "@/redux/features/api/apiSlice";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Admins({ admins }) {
  const [addAdminToWhitelist, { isLoading }] = useAddAdminToWhitelistMutation();
  const [email, setEmail] = useState("");

  const router = useRouter();

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-primary">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <span className="">{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => (
        <span>
          {
            // format date
            new Date(data).toTimeString()
          }
        </span>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Radish Admin / Admins</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="">
        <h2 className="text-2xl font-bold text-center my-6">
          Admins Whitelist
        </h2>
        <section className="flex items-start justify-between px-4 py-8">
          <div className="w-[45%] ">
            <Table
              columns={columns}
              dataSource={admins}
              pagination={{ pageSize: 5 }}
              rowKey={(record) => record._id}
            />
          </div>
          <div className="w-[45%]">
            <div className="max-w-xl mx-auto">
              <Input
                placeholder="Enter admin email"
                size="large"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="mt-6 w-full"
                type="primary"
                size="large"
                loading={isLoading}
                onClick={() => {
                  addAdminToWhitelist({ email }).then((res) => {
                    if (res.data?.success) {
                      message.success("Email Whitelisting request sent");
                      router.push(
                        `/verify-whitelist-request?id=${res.data.OTPuuid}&email=${email}`
                      );
                    } else {
                      message.error("Something went wrong");
                    }
                  });
                }}
              >
                Add To Whitelist
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // console.log("session", session);
  const response = await axios.get(
    `${process.env.API_BASE_URL}/api/admin/auth/whitelist`
  );

  // console.log("response", response.data);

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
      admins: response.data.admins,
    },
  };
}