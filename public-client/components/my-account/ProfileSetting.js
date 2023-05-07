import { Button, Input, Popconfirm, Spin, message } from "antd";
import {
  MdOutlineNorthEast,
  MdOutlinePeopleAlt,
  MdOutlineEmail,
  MdOutlineInfo,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import profilePlaceholder from "../../images/avatar.png";
import bannerPlaceholder from "../../images/collection/collection-banner.png";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  useChangeUserPasswordMutation,
  useEditProfileMutation,
  useGetAllUserNamesQuery,
  useUpdateSocialMutation,
} from "@/redux/features/api/apiSlice";
import { useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ProfileSetting({ userDefaults }) {
  const root = useSelector((state) => state.main.root);
  const { data: usersData } = useGetAllUserNamesQuery();

  const router = useRouter();
  const [editProfile, { isLoading }] = useEditProfileMutation();
  const [updateSocial, { isLoading: updateSocialLoading }] =
    useUpdateSocialMutation();
  const [changeUserPassword, { isLoading: changeUserPasswordLoading }] =
    useChangeUserPasswordMutation();
  const [profilePictureUpdateLoading, setProfilePictureUpdateLoading] =
    useState(false);
  const [bannerPictureUpdateLoading, setBannerPictureUpdateLoading] =
    useState(false);

  const profilePicInputRef = useRef(null);
  const bannerPicInputRef = useRef(null);

  return (
    <div className="flex gap-x-24">
      <div className="w-full">
        <p className="font-extrabold text-[24px] sm:text-[32px]">
          Profile details
        </p>

        <Button
          className="flex items-center gap-x-2 w-[182px] h-[43px] rounded-[12px] font-bold  my-6"
          onClick={() => {
            router.push(`/profile/${session.token.sub}`);
          }}
        >
          <MdOutlineNorthEast className="h-5 w-5 " />
          View my account
        </Button>

        <form
          className="max-w-full lg:max-w-[470px]"
          onSubmit={(e) => {
            e.preventDefault();
            // console.log(e.target.fullName.value);
            // console.log(e.target.email.value);
            // console.log(e.target.username.value);
            // console.log(e.target.bio.value);
            let data = {};

            if (e.target.fullName.value) {
              data.name = e.target.fullName.value;
            }
            if (e.target.email.value) {
              data.email = e.target.email.value;
            }
            // if (e.target.username.value) {
            //   if (
            //     usersData?.users?.some(
            //       (user) => user.username === e.target.username.value
            //     )
            //   ) {
            //     message.error("Username already taken");
            //     return;
            //   }
            //   data.username = e.target.username.value;
            // }
            if (e.target.bio.value) {
              data.bio = e.target.bio.value;
            }

            editProfile({
              userId: session.token.sub,
              data,
            }).then((res) => {
              // console.log(res);
              message.success("Profile updated successfully");
            });
          }}
        >
          <div className="w-full">
            <label htmlFor="fullName" className=" block text-sm">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={userDefaults.name}
              size="large"
              placeholder="Enter your full name"
              // suffix={
              //   <MdOutlinePeopleAlt className="text-secondaryGray w-5 h-5" />
              // }
              style={{
                borderRadius: "24px",
              }}
              className="py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm  mt-2"
            />
          </div>

          <div className="w-full mt-3">
            <label htmlFor="email" className=" block text-sm">
              Email
            </label>
            <Input
              disabled={true}
              defaultValue={userDefaults.email}
              id="email"
              name="email"
              type="email"
              size="large"
              placeholder="Enter your email"
              // suffix={<MdOutlineEmail className="text-secondaryGray w-5 h-5" />}
              style={{
                borderRadius: "24px",
              }}
              className="py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm  mt-2"
            />
          </div>

          <div className="w-full mt-3">
            <label htmlFor="username" className=" block text-sm">
              Username
            </label>
            <Input
              id="username"
              name="username"
              disabled={true}
              defaultValue={userDefaults.username}
              size="large"
              placeholder="Choose your username"
              // suffix={<MdOutlineInfo className="text-secondaryGray w-5 h-5" />}
              style={{
                borderRadius: "24px",
              }}
              className=" py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm mt-2"
            />
          </div>

          <div className="w-full mt-3">
            <label htmlFor="bio" className=" block text-sm">
              Bio
            </label>
            <Input.TextArea
              id="bio"
              name="bio"
              defaultValue={userDefaults.bio}
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
            loading={
              isLoading &&
              (profilePictureUpdateLoading || bannerPictureUpdateLoading)
            }
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
            // console.log(e.target.facebook.value);
            // console.log(e.target.twitter.value);

            // check if tghe url is facebook valid url
            if (e.target.facebook.value) {
              const url = new URL(e.target.facebook.value);
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

            let data = {};

            if (e.target.facebook.value) {
              data.facebook = e.target.facebook.value;
            }
            if (e.target.twitter.value) {
              data.twitter = e.target.twitter.value;
            }

            // console.log(data);

            updateSocial({
              userId: session.token.sub,
              data,
            }).then((res) => {
              // console.log(res);
              message.success("Social updated successfully");
            });
          }}
        >
          <div className="w-full">
            <label htmlFor="facebook" className=" block text-sm">
              Telegram
            </label>
            <Input
              id="facebook"
              name="facebook"
              defaultValue={userDefaults.facebook}
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
              defaultValue={userDefaults.twitter}
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
            loading={updateSocialLoading}
            htmlType="submit"
          >
            Update Social
          </Button>
        </form>

        <form
          className="max-w-full lg:max-w-[470px] mt-16"
          onSubmit={async (e) => {
            e.preventDefault();

            if (
              !e.target.oldPassword.value ||
              !e.target.newPassword.value ||
              !e.target.confirmPassword.value
            ) {
              return message.error("All fields are required");
            }

            if (e.target.newPassword.value !== e.target.confirmPassword.value) {
              return message.error("Passwords do not match");
            }

            const data = {
              userId: session?.token?.sub,
              oldPassword: e.target.oldPassword.value,
              newPassword: e.target.newPassword.value,
            };

            // console.log(data);

            changeUserPassword(data).then((res) => {
              if (res.data?.success) {
                message.success("Password changed successfully");
                signOut();
              } else {
                message.error("Something went wrong");
              }
            });
          }}
        >
          <p className="font-bold  text-[24px] mb-6">Change Password</p>
          <div className="w-full mt-3">
            <label htmlFor="oldPassword" className=" block text-sm">
              Old Password
            </label>
            <Input.Password
              id="oldPassword"
              name="oldPassword"
              size="large"
              placeholder="Enter your old password"
              style={{
                borderRadius: "24px",
                fontWeight: "bold",
              }}
              className="py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm mt-2"
            />
          </div>
          <div className="w-full mt-3">
            <label htmlFor="newPassword" className=" block text-sm">
              New Password
            </label>
            <Input.Password
              id="newPassword"
              name="newPassword"
              size="large"
              placeholder="Enter your new password"
              style={{
                borderRadius: "24px",
                fontWeight: "bold",
              }}
              className=" py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm mt-2"
            />
          </div>
          <div className="w-full mt-3">
            <label htmlFor="confirmPassword" className=" block text-sm">
              Confirm Password
            </label>
            <Input.Password
              id="confirmPassword"
              name="confirmPassword"
              size="large"
              placeholder="Confirm your new password"
              style={{
                borderRadius: "24px",
                fontWeight: "bold",
              }}
              className="py-3 px-5 placeholder:text-secondaryGray !placeholder:font-normal placeholder:text-sm mt-2"
            />
          </div>

          <Button
            className="w-full rounded-[24px] h-[46px] font-bold mt-10"
            type="primary"
            htmlType="submit"
            loading={changeUserPasswordLoading}
          >
            Change Password
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
                // console.log(e.target.files[0]);
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
                      editProfile({
                        userId: session.token.sub,
                        data: {
                          profilePicture: res.data.url,
                        },
                      }).then((res) => {
                        // console.log(res);
                        if (res.data.success) {
                          setProfilePictureUpdateLoading(false);
                          message.success("Profile picture updated");
                        } else {
                          setProfilePictureUpdateLoading(false);
                          message.error("Something went wrong");
                        }
                      });
                    } else {
                      setProfilePictureUpdateLoading(false);
                      message.error("Something went wrong");
                    }
                  });
              }}
            />
            <div className="relative w-[100px] h-[100px] group">
              <Image
                src={root.user?.profilePicture || profilePlaceholder}
                width={100}
                height={100}
                quality={100}
                className="rounded-full cursor-pointer"
                onClick={() => {
                  profilePicInputRef.current.click();
                }}
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
                      editProfile({
                        userId: session.token.sub,
                        data: {
                          profileBanner: res.data.url,
                        },
                      }).then((res) => {
                        // console.log(res);
                        if (res.data?.success) {
                          setBannerPictureUpdateLoading(false);
                          message.success("Profile banner updated");
                        } else {
                          setBannerPictureUpdateLoading(false);
                          message.error("Something went wrong");
                        }
                      });
                    } else {
                      message.error("Something went wrong");
                      setBannerPictureUpdateLoading(false);
                    }
                  });
              }}
            />
            <div className="w-[100px] h-[100px] rounded-full relative group">
              <Image
                src={root.user?.profileBanner || bannerPlaceholder}
                width={100}
                objectFit="cover"
                height={100}
                quality={100}
                className="rounded-full cursor-pointer object-cover"
                onClick={() => {
                  bannerPicInputRef.current.click();
                }}
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
              signOut();
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
