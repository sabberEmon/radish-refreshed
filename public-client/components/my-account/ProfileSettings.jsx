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
import {
  useAddWalletMutation,
  useDeleteWalletMutation,
  useEditProfileMutation,
} from "@/redux/features/api/apiSlice";

export default function ProfileSettings({ user, setAddWalletModalVisible }) {
  const root = useSelector((state) => state.main.root);
  const [deleteWallet] = useDeleteWalletMutation();
  const [editProfile, { isLoading: editProfileLoading }] =
    useEditProfileMutation();

  const router = useRouter();
  const dispatch = useDispatch();

  const [profilePictureUpdateLoading, setProfilePictureUpdateLoading] =
    useState(false);
  const [bannerPictureUpdateLoading, setBannerPictureUpdateLoading] =
    useState(false);
  const [addWallet, { isLoading: addWalletIsLoading }] = useAddWalletMutation();

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

  const addWalletHandler = async () => {
    if (!root.actionWallet) {
      message.info("Please connect the wallet you want to add to your account");
      return;
    }

    if (root.actionWalletType === "z3us") {
      await window.z3us.v1.connect();
      await window.z3us.v1.sign("Login to RadishSquare");
    }

    if (root.actionWalletType === "xidar") {
      await window.xidar.v1.connect();
      await window.xidar.v1.sign("Login to RadishSquare");
    }

    addWallet({
      wallet: root.actionWallet,
    })
      .unwrap()
      .then((res) => {
        message.success("Wallet added successfully");
        // setAddWalletModalVisible(false);
        // setNewWallet("");
      })
      .catch((err) => {
        message.error(err.data?.message || "Something went wrong");
      });
  };

  // update profile handler
  const updateProfileHandler = (data) => {
    message.loading({
      content: "Updating profile...",
      key: "updateProfile",
    });

    editProfile({
      data,
    })
      .unwrap()
      .then((res) => {
        message.success({
          content: "Profile updated",
          key: "updateProfile",
        });
      })
      .catch((err) => {
        message.error({
          content: "Error updating profile",
          key: "updateProfile",
        });
      });
  };

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
            onClick={addWalletHandler}
            loading={addWalletIsLoading}
          >
            Add Wallet
          </Button>
        </div>

        <form
          className="max-w-full lg:max-w-[470px]"
          onSubmit={(e) => {
            e.preventDefault();

            let data = {};

            // check if tghe url is telegram valid url
            if (e.target.telegram.value) {
              const url = new URL(e.target.telegram.value);
              if (
                url.hostname !== "telegram.org" &&
                url.hostname !== "t.me" &&
                url.hostname !== "web.telegram.org"
              ) {
                return message.error("Invalid telegram url");
              }
            }

            // check if tghe url is twitter valid url
            if (e.target.twitter.value) {
              const url = new URL(e.target.twitter.value);
              if (url.hostname !== "twitter.com") {
                return message.error("Invalid twitter url");
              }
            }

            if (e.target.name.value) {
              data.name = e.target.name.value;
            }

            if (e.target.bio.value) {
              data.bio = e.target.bio.value;
            }

            if (e.target.telegram.value) {
              data.telegram = e.target.telegram.value;
            }
            if (e.target.twitter.value) {
              data.twitter = e.target.twitter.value;
            }

            // console.log(data);

            updateProfileHandler(data);
          }}
        >
          <div className="w-full">
            <label htmlFor="name" className=" block text-sm">
              Name
            </label>
            <Input
              id="name"
              name="name"
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

          <div className="w-full mt-3">
            <label htmlFor="telegram" className=" block text-sm">
              Telegram
            </label>
            <Input
              id="telegram"
              name="telegram"
              defaultValue={user?.telegram}
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
            htmlType="submit"
            disabled={editProfileLoading}
          >
            Save Changes
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
              onChange={(e) => {
                setProfilePictureUpdateLoading(true);
                const formData = new FormData();
                formData.append("file", e.target.files[0]);

                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_RESOURCES_BASE_URL}/action/add-item`,
                    formData
                  )
                  .then((res) => {
                    // console.log(res.data);
                    if (res.data.success) {
                      let data = {
                        profilePicture: res.data.url,
                      };

                      updateProfileHandler(data);
                      setProfilePictureUpdateLoading(false);
                    } else {
                      setProfilePictureUpdateLoading(false);
                      message.error("Something went wrong");
                    }
                  });
              }}
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
                <MdOutlineModeEditOutline className="text-gray-200 text-[24px]" />
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
              onChange={(e) => {
                setBannerPictureUpdateLoading(true);
                const formData = new FormData();
                formData.append("file", e.target.files[0]);

                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_RESOURCES_BASE_URL}/action/add-item`,
                    formData
                  )
                  .then((res) => {
                    // console.log(res.data);
                    if (res.data.success) {
                      let data = {
                        profileBanner: res.data.url,
                      };

                      updateProfileHandler(data);
                      setBannerPictureUpdateLoading(false);
                    } else {
                      setProfilePictureUpdateLoading(false);
                      message.error("Something went wrong");
                    }
                  });
              }}
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
                <MdOutlineModeEditOutline className="text-gray-200 text-[24px]" />
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
