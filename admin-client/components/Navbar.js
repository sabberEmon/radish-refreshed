import { UserDeleteOutlined } from "@ant-design/icons";
import { Avatar, Popconfirm } from "antd";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="w-full px-4 py-3 border-solid border-b border-t-0 border-l-0 border-r-0 border-b-[#CFDBD526] flex items-center">
      <div className="flex items-center gap-x-6">
        <div className="w-10 h-10 flex items-center justify-center text-white font-bold bg-primary rounded-full cursor-pointer">
          Red.
        </div>
        <div className="flex gap-x-4 ">
          <span
            className={`font-bold cursor-pointer ${
              router.pathname === "/" ? "text-primary" : "text-white"
            }`}
            onClick={() => router.push("/")}
          >
            Home
          </span>
          <span
            className={`font-bold cursor-pointer ${
              router.pathname.includes("/collections")
                ? "text-primary"
                : "text-white"
            }`}
            onClick={() => router.push("/collections")}
          >
            Collections
          </span>
          {/* <span
            className={`font-bold cursor-pointer ${
              router.pathname.includes("/ads") ? "text-primary" : "text-white"
            }`}
            onClick={() => router.push("/ads")}
          >
            Ads
          </span> */}
          <span
            className={`font-bold cursor-pointer ${
              router.pathname.includes("/admins")
                ? "text-primary"
                : "text-white"
            }`}
            onClick={() => router.push("/admins")}
          >
            Admins
          </span>
        </div>
      </div>
      <Popconfirm
        title="Logout"
        description="Are you sure to logout?"
        onConfirm={() => {
          signOut();
        }}
        okText="Yes"
        placement="bottomLeft"
        cancelText="No"
      >
        <Avatar
          icon={<UserDeleteOutlined />}
          size=""
          className="ml-auto cursor-pointer"
        />
      </Popconfirm>
    </nav>
  );
}
