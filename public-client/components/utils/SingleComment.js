import Image from "next/image";
import profilePlaceholder from "../../images/avatar.png";
import { useState } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
} from "date-fns";
import { Button, message } from "antd";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { useLikeCommentMutation } from "@/redux/features/api/apiSlice";
import { useRouter } from "next/router";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";

export default function SingleComment({
  comment,
  inputRef,
  setInputValue,
  setTargetComment,
  nft,
}) {
  // console.log(comment);
  const root = useSelector((state) => state.main.root);
  const router = useRouter();

  const [replyPage, setReplyPage] = useState(0);
  const [loveCount, setLoveCount] = useState(comment.likes?.length);
  // see if the user is in nft likes array
  const [isLoved, setIsLoved] = useState(
    comment?.likes?.includes(root.user?._id) || false
  );

  // console.log("comment", comment);
  const [likeComment, { isLoading: isLikeLoading }] = useLikeCommentMutation();
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-x-2">
          <Image
            src={comment.user.profilePicture || profilePlaceholder}
            width={48}
            quality={100}
            height={48}
            className="rounded-full cursor-pointer"
            onClick={() => {
              router.push(`/profile/${comment.user._id}`);
            }}
            alt="profile picture"
          />
          <div>
            <p
              className="text-sm font-bold cursor-pointer"
              onClick={() => {
                router.push(`/profile/${comment.user._id}`);
              }}
            >
              {comment.user.name || "Guest User"}
            </p>
            <p className="text-sm text-secondaryGray mt-1">{comment.text}</p>
          </div>
        </div>
        <div className="text-secondaryGray">
          {
            // date in this format as in 1 month ago, 5 days ago, 2 hours ago, 1 minute ago, just now
            differenceInMonths(new Date(), new Date(comment.createdAt)) > 0
              ? new Date(comment.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })
              : differenceInDays(new Date(), new Date(comment.createdAt)) > 0
              ? `${differenceInDays(
                  new Date(),
                  new Date(comment.createdAt)
                )} days ago`
              : differenceInHours(new Date(), new Date(comment.createdAt)) > 0
              ? `${differenceInHours(
                  new Date(),
                  new Date(comment.createdAt)
                )} hour${
                  differenceInHours(new Date(), new Date(comment.createdAt)) > 1
                    ? "s"
                    : ""
                } ago`
              : differenceInMinutes(new Date(), new Date(comment.createdAt)) > 0
              ? `${differenceInMinutes(
                  new Date(),
                  new Date(comment.createdAt)
                )} minute${
                  differenceInMinutes(new Date(), new Date(comment.createdAt)) >
                  1
                    ? "s"
                    : ""
                } ago`
              : "just now"
          }
        </div>
      </div>

      <div className="flex items-center">
        <div
          className="w-[60px] h-[46px] rounded-[12px] flex items-center justify-center gap-1 font-bold px-3 cursor-pointer"
          onClick={() => {
            if (!root.user) {
              message.error("Please login to continue");
            }
            if (comment.user._id === root.user._id) {
              message.warning("You can't favourite your own comment");
              return;
            }
            likeComment({
              commentId: comment._id,
              userId: root.user?._id,
            }).then((res) => {
              setIsLoved((prev) => !prev);
              setLoveCount((prev) => (prev += isLoved ? -1 : 1));
              if (res.data?.hasLiked) {
                root.socket.emit("save-new-individual-notification", {
                  for: comment.user._id,
                  type: "user",
                  referenceUser: root.user?._id,
                  message: {
                    text: `User, favourited your Comment on ${nft.title}`,
                    link: `/nft/${nft._id}`,
                  },
                });
              }
            });
          }}
        >
          {isLoved ? (
            <HeartFilledIcon className="h-5 w-5 text-primary" />
          ) : (
            <HeartIcon className="h-5 w-5 text-[#030E17] dark:text-white" />
          )}
          <span>{loveCount}</span>
        </div>
        <p
          className="text-primary font-semibold hover:underline cursor-pointer transition-all ease-in-out duration-200 "
          onClick={() => {
            setTargetComment(comment);
            setInputValue(comment.user?.name ? `@${comment.user.name} ` : "");
            inputRef.current.focus();
          }}
        >
          Reply
        </p>
        {
          // if the comment has replies then show the show replies button and if the comment has more than 2 replies then show the show more button
          comment?.replies?.length > 0 && (
            <p
              className="text-primary font-semibold hover:underline cursor-pointer transition-all ease-in-out duration-200 ml-2"
              // onClick={() => {
              //   setShowReplies((prev) => !prev);
              // }}
            >
              {showReplies && comment.replies?.length > 2 ? (
                <span
                  onClick={() => {
                    if (replyPage * 2 + 2 < comment.replies?.length) {
                      setReplyPage((prev) => prev + 1);
                    } else {
                      setReplyPage(0);
                      setShowReplies((prev) => !prev);
                    }
                  }}
                >
                  {replyPage * 2 + 2 < comment.replies?.length
                    ? "Show more"
                    : "Hide replies"}
                </span>
              ) : (
                <span
                  onClick={() => {
                    setShowReplies((prev) => !prev);
                  }}
                  className="flex items-center gap-x-1"
                >
                  <MdOutlineSubdirectoryArrowRight className="h-5 w-5 inline-block" />{" "}
                  {comment.replies?.length}{" "}
                  {comment.replies?.length > 1 ? "replies" : "reply"}
                </span>
              )}
            </p>
          )
        }
      </div>

      <div>
        {comment?.replies?.length > 0 &&
          showReplies &&
          comment.replies?.slice(0, replyPage * 2 + 2).map((reply) => {
            return (
              <>
                <div>
                  <div className="flex items-center justify-between gap-x-2 mt-2 ml-[75px]">
                    <div className="flex items-center gap-x-2 ">
                      <Image
                        src={reply.user.profilePicture || profilePlaceholder}
                        width={48}
                        height={48}
                        className="rounded-full"
                        alt="profile picture"
                      />
                      <div>
                        <p className="text-sm font-bold ">{reply.user.name}</p>
                        <p className="text-sm text-secondaryGray mt-1">
                          {reply.text}
                        </p>
                      </div>
                    </div>
                    <div className="text-secondaryGray">
                      {
                        // date in this format as in 1 month ago, 5 days ago, 2 hours ago, 1 minute ago, just now
                        differenceInMonths(
                          new Date(),
                          new Date(reply.createdAt)
                        ) > 0
                          ? new Date(reply.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                          : differenceInDays(
                              new Date(),
                              new Date(reply.createdAt)
                            ) > 0
                          ? `${differenceInDays(
                              new Date(),
                              new Date(reply.createdAt)
                            )} days ago`
                          : differenceInHours(
                              new Date(),
                              new Date(reply.createdAt)
                            ) > 0
                          ? `${differenceInHours(
                              new Date(),
                              new Date(reply.createdAt)
                            )} hours ago`
                          : differenceInMinutes(
                              new Date(),
                              new Date(reply.createdAt)
                            ) > 0
                          ? `${differenceInMinutes(
                              new Date(),
                              new Date(reply.createdAt)
                            )} minutes ago`
                          : "just now"
                      }
                    </div>
                  </div>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
}
