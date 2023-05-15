import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ReactComponent as RadishLogo } from "../../images/radish.svg";
import { useSubscribeToNewsletterMutation } from "@/redux/features/api/apiSlice";
import { message } from "antd";

export default function Footer() {
  const router = useRouter();
  const [subscribeToNewsletter, { isLoading, isError }] =
    useSubscribeToNewsletterMutation();

  const [email, setEmail] = useState("");

  return (
    <section className="w-full pt-8 mt-10">
      <div className="max-w-[1280px] mx-auto px-4 flex justify-start sm:items-center gap-[30px] sm:gap-[25px] md:gap-[10%] items-start w-full flex-wrap sm:flex-wrap md:flex-wrap lg:flex-nowrap flex-col-reverse sm:flex-col lg:flex-row">
        {/* desktop */}
        <div className="w-fit sm:w-full hidden sm:block">
          <div className="flex items-center gap-x-2">
            <div
              className="w-10 h-10 flex items-center justify-center  rounded-full p-1 cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              <RadishLogo className="w-[40px] h-[40px]" />
            </div>
            <span className="text-[27px] font-bold ">Radish</span>
          </div>
          <p className="mt-3">Empowering the creative economy.</p>
        </div>

        <div className="w-fit sm:w-full">
          <p className=" font-bold">Quick Links</p>
          <p
            className="text-sm mt-3 cursor-pointer hover:text-primary"
            onClick={() => {
              router.push("/explore");
            }}
          >
            Explore
          </p>
          <p
            className="text-sm mt-3 cursor-pointer hover:text-primary"
            onClick={() => {}}
          >
            My Account
          </p>
          <p
            className="text-sm mt-3 cursor-pointer hover:text-primary"
            onClick={() => {
              router.push("/swap");
            }}
          >
            Swap
          </p>
        </div>

        <div className="w-fit sm:w-full">
          <p className=" font-bold">Community</p>
          <p
            className="text-sm mt-3 cursor-pointer hover:text-primary"
            onClick={() => {
              window.open("https://t.me/radishroot", "_blank");
            }}
          >
            Telegram
          </p>
          <p
            className="text-sm mt-3 cursor-pointer hover:text-primary"
            onClick={() => {
              window.open("https://twitter.com/RadishEco", "_blank");
            }}
          >
            Twitter
          </p>
          <p
            className="text-sm mt-3 cursor-pointer  hover:text-primary"
            onClick={() => {
              window.open("https://www.instagram.com/RadishEco/", "_blank");
            }}
          >
            Instagram
          </p>
        </div>

        {/* mobile  */}
        <div className="w-fit sm:w-full sm:hidden">
          <div className="flex items-center gap-x-2">
            <div
              className="w-10 h-10 flex items-center justify-center  rounded-full p-1 cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              <RadishLogo className="w-[40px] h-[40px]" />
            </div>
            <span className="text-[27px] font-bold ">Radish</span>
          </div>
          <p className="mt-3">Empowering the creative economy.</p>
        </div>

        <div className="w-full sm:w-full lg:max-w-[352px] md:mt-5 lg:mt-0">
          <p className=" font-bold">Join Newsletter</p>
          <p className="text-sm mt-3">
            Subscribe to our newsletter to get the latest news about the Radish
            Eco farm.
          </p>
          <div className="mt-4 sm:w-[352px] w-full h-[48px] border border-solid border-[#E6E8EC] rounded-[90px] flex items-center px-3">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow outline-none border-none h-full bg-transparent px-2 placeholder:font-normal font-normal placeholder:text-[#030E1799] dark:placeholder:text-white"
            />
            <div
              className="cursor-pointer w-[32px] h-[32px] flex justify-center items-center bg-primary text-white rounded-[100px]"
              onClick={() => {
                // verify the email as a valid email
                if (!email) {
                  message.error("Email is required");
                  return;
                }

                // verify the email address as a valid email address with regex
                const re = /\S+@\S+\.\S+/;
                if (!re.test(email)) {
                  message.error("Invalid email address");
                  return;
                }

                message.loading({
                  content: "Subscribing to newsletter...",
                  key: "subscribe",
                });

                subscribeToNewsletter({ email }).then((res) => {
                  if (res?.data?.success) {
                    setEmail("");
                    message.success({
                      content: "Subscribed to newsletter",
                      key: "subscribe",
                    });
                  } else {
                    message.info({
                      content: "Already subscribed to newsletter",
                      key: "subscribe",
                    });
                  }
                });
              }}
            >
              <ArrowRightIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#E6E8EC] dark:bg-gray-600 mt-12"></div>

      <p className="text-[#030E1780] dark:text-white text-center my-4 text-sm">
        Copyright © 2023 Radish. Powered by Crew Labs. All rights reserved.
      </p>
    </section>
  );
}
