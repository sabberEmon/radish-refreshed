import { Button } from "antd";
import { ReactComponent as SendIcon } from "../../images/nft/send.svg";
import WalletNumber from "../utils/WalletNumber";
import { useState } from "react";

export default function Activities({ activities }) {
  const [activityPage, setactivityPage] = useState(0);

  return (
    <>
      <div className="space-y-3">
        {activities.slice(0, activityPage * 4 + 4).map((activity, index) => {
          return (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-[60px] h-[60px] rounded-full bg-[#DE345E1A] flex items-center justify-center">
                  <SendIcon className="w-[24px] h-[24px] text-[#DE345E] mb-2" />
                </div>
                <div>
                  <p className="text-secondaryDarkGray">
                    Transferred to
                    <WalletNumber
                      walletNumber={activity.receiverWallet}
                      style="!m-0 font-bold"
                    />
                  </p>
                </div>
              </div>
              <div className="text-secondaryGray">
                {
                  // date in this format Jan 25, 2023 | 15:35 pm
                  new Date(activity.date).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                }
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-fit mx-auto mt-10 mb-4">
        {activities?.length > 4 &&
          activityPage * 4 + 4 < activities?.length && (
            <Button
              className="w-[118px] h-[43px] rounded-xl font-bold text-sm"
              onClick={() => setactivityPage(activityPage + 1)}
            >
              Load More
            </Button>
          )}
      </div>
    </>
  );
}
