import { Button, Input, Popconfirm, Spin, Table, Tag, message } from "antd";
import { MdOutlineNorthEast, MdOutlineModeEditOutline } from "react-icons/md";
import profilePlaceholder from "../../images/avatar.png";
import bannerPlaceholder from "../../images/collection-banner.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import WalletNumber from "../utils/WalletNumber";
import { useDeleteWalletMutation } from "@/redux/features/api/apiSlice";

export default function ProfileSettings({ user, setAddWalletModalVisible }) {
  const root = useSelector((state) => state.main.root);
  const [deleteWallet] = useDeleteWalletMutation();

  const router = useRouter();
  const dispatch = useDispatch();

  const [profilePictureUpdateLoading, setProfilePictureUpdateLoading] =
    useState(false);
  const [bannerPictureUpdateLoading, setBannerPictureUpdateLoading] =
    useState(false);

  const profilePicInputRef = useRef(null);
  const bannerPicInputRef = useRef(null);

  const columns = [
    {
      title: "Wallet",
      dataIndex: "wallet",
      key: "wallet",
      render: (text) => (
        <p>
          {
            <WalletNumber
              walletNumber={text}
              style="!m-0 !p-0 text-primary font-bold"
            />
          }
        </p>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (text) => (
        <>
          {text === "Primary" ? (
            <Tag color="green">{text}</Tag>
          ) : (
            <Tag color="blue">{text}</Tag>
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          size="small"
          onClick={() => {
            if (record.wallet === user?.primaryWallet) {
              message.error("Cannot delete primary wallet");
              return;
            }
            message.loading({
              content: "Deleting wallet...",
              key: "deleteWallet",
            });
            deleteWallet({
              wallet: record.wallet,
            })
              .unwrap()
              .then((res) => {
                message.success({
                  content: "Wallet deleted",
                  key: "deleteWallet",
                });
              })
              .catch((err) => {
                message.error({
                  content: "Error deleting wallet",
                  key: "deleteWallet",
                });
              });
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="flex gap-x-24">
      <div className="w-full">
        <p className="font-extrabold text-[24px] sm:text-[32px]">
          Profile details
        </p>

        <Button
          className="flex items-center gap-x-2 w-[182px] h-[43px] rounded-[12px] font-bold  my-6"
          onClick={() => {
            router.push(`/profile/${root.user?.uuid}`);
          }}
        >
          <MdOutlineNorthEast className="h-5 w-5 " />
          View my account
        </Button>

        <div className="max-w-full lg:max-w-[470px] my-8 lg:my-10">
          <Table
            columns={columns}
            dataSource={user?.wallets.map((wallet) => ({
              key: wallet,
              wallet: wallet,
              tag: wallet === user?.primaryWallet ? "Primary" : "Secondary",
            }))}
            pagination={false}
          />

          <Button
            className="w-full rounded-[24px] h-[46px] font-bold mt-10"
            type="primary"
            onClick={() => {
              setAddWalletModalVisible(true);
            }}
          >
            Add Wallet
          </Button>
        </div>

        <form
          className="max-w-full lg:max-w-[470px]"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="w-full">
            <label htmlFor="fullName" className=" block text-sm">
              Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={user?.name}
              size="large"
              placeholder="Enter your name"
              style={{
                borderRadius: "24px",
              }}
              className="py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm  mt-2"
            />
          </div>

          <div className="w-full mt-3">
            <label htmlFor="bio" className=" block text-sm">
              Bio
            </label>
            <Input.TextArea
              id="bio"
              name="bio"
              defaultValue={user?.bio}
              size="large"
              placeholder="Tell the world your story"
              style={{
                borderRadius: "12px",
                minHeight: "140px",
              }}
              className="py-3 px-5  placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm mt-2 "
            />
          </div>

          <Button
            className="w-full rounded-[24px] h-[46px] font-bold mt-10"
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        </form>

        {/* social form */}
        <form
          className="max-w-full lg:max-w-[470px] mt-16"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="w-full">
            <label htmlFor="facebook" className=" block text-sm">
              Telegram
            </label>
            <Input
              id="facebook"
              name="facebook"
              defaultValue={user?.facebook}
              size="large"
              placeholder="Enter your telegram link"
              style={{
                borderRadius: "24px",
              }}
              className="py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm  mt-2"
            />
          </div>

          <div className="w-full mt-3">
            <label htmlFor="twitter" className=" block text-sm">
              Twitter
            </label>
            <Input
              id="twitter"
              name="twitter"
              defaultValue={user?.twitter}
              size="large"
              placeholder="Enter your twitter link"
              style={{
                borderRadius: "24px",
              }}
              className=" py-3 px-5  placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm mt-2"
            />
          </div>

          <Button
            className="w-full rounded-[24px] h-[46px] font-bold mt-10"
            type="primary"
            // loading={updateSocialLoading}
            htmlType="submit"
          >
            Update Social
          </Button>
        </form>
      </div>

      <div className="hidden xl:block">
        <div className="mt-[135px]">
          <div className="flex items-center gap-x-3">
            <input
              type="file"
              className="hidden"
              ref={profilePicInputRef}
              onChange={(e) => {}}
            />
            <div className="relative w-[100px] h-[100px] group">
              <Image
                src={user?.profilePicture || profilePlaceholder}
                width={100}
                height={100}
                quality={100}
                className="rounded-full cursor-pointer"
                onClick={() => {
                  profilePicInputRef.current.click();
                }}
                alt="profile picture"
              />
              <div
                className={`absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer ${
                  profilePictureUpdateLoading && "opacity-100"
                }`}
                onClick={() => {
                  profilePicInputRef.current.click();
                }}
              >
                {profilePictureUpdateLoading ? (
                  <Spin />
                ) : (
                  <MdOutlineModeEditOutline className="text-gray-200 text-[24px]" />
                )}
              </div>
            </div>
            <div>
              <p className=" font-bold text-[18px]">Profile Picture</p>
              <p className="mt-2 text-sm text-secondaryGray">
                Change to your favorite profile picture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-x-3 mt-5">
            <input
              type="file"
              className="hidden"
              ref={bannerPicInputRef}
              onChange={(e) => {}}
            />
            <div className="w-[100px] h-[100px] rounded-full relative group">
              <Image
                src={user?.profileBanner || bannerPlaceholder}
                width={100}
                objectFit="cover"
                height={100}
                quality={100}
                className="rounded-full cursor-pointer object-cover"
                onClick={() => {
                  bannerPicInputRef.current.click();
                }}
                alt="banner picture"
              />
              <div
                className={`absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer ${
                  bannerPictureUpdateLoading && "opacity-100"
                }`}
                onClick={() => {
                  bannerPicInputRef.current.click();
                }}
              >
                {bannerPictureUpdateLoading ? (
                  <Spin />
                ) : (
                  <MdOutlineModeEditOutline className="text-gray-200 text-[24px]" />
                )}
              </div>
            </div>
            <div>
              <p className=" font-bold text-[18px]">Profile Banner</p>
              <p className="mt-2 text-sm text-secondaryGray">
                Get noticed and drive more traffic to your profile with an
                eye-catching banner.
              </p>
            </div>
          </div>

          <Popconfirm
            title="Are you sure to logout?"
            // description="Are you sure to delete this task?"
            onConfirm={() => {
              dispatch({
                type: "root/logout",
              });
              message.success("Logged out successfully");
              router.replace("/");
            }}
            okText="Yes"
            cancelText="No"
            placement="bottomRight"
          >
            <Button className="w-full rounded-[24px] h-[46px] font-bold mt-10">
              Logout
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
}
