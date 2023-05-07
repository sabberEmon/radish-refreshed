import { Button, Mentions, Skeleton, message } from "antd";
import EmojiPicker from "emoji-picker-react";
import SingleComment from "../utils/SingleComment";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  useAddCommentMutation,
  useAddReplyMutation,
  useGetCommentsQuery,
} from "@/redux/features/api/apiSlice";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function CommentSection({ users, nft, owner, collection }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const root = useSelector((state) => state.main.root);

  const [inputValue, setInputValue] = useState("");
  const [tagOptions, setTagOptions] = useState([]);
  const [mentionedUser, setMentionedUser] = useState("");
  const [targetComment, setTargetComment] = useState(null);
  const [commentPage, setCommentPage] = useState(0);
  const { theme } = useTheme();
  const router = useRouter();

  const { data: commentsData, isLoading: commentsDataLoading } =
    useGetCommentsQuery({
      nftId: router.query.nftId,
    });
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [addReply, { isLoading: isReplyLoading }] = useAddReplyMutation();

  const inputRef = useRef();

  // on emoji select add emoji to input
  const onEmojiClick = (emojiData, event) => {
    setInputValue(inputValue + emojiData.emoji);
    setShowEmojiPicker(false);
    // focus on input ref
    inputRef.current.focus();
  };

  // useEffect(() => {
  //   if (inputValue?.includes("@")) {
  //     // only pass max 10 users for suggestions
  //     const data = users?.map((user) => {
  //       if (user?._id === session?.token?.sub) {
  //         // skip current user
  //         return {};
  //       } else {
  //         return {
  //           key: user._id,
  //           value: user.username,
  //           label: user.username,
  //         };
  //       }
  //     });

  //     setTagOptions(data);
  //   } else {
  //     setTagOptions([]);
  //   }
  // }, [inputValue]);

  // console.log(commentsData);

  return (
    <div className="w-full">
      <div className="h-[64px] rounded-[12px] border border-solid border-[#CFDBD599] flex px-3 relative py-2">
        {/* <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Leave a comment..."
          className="flex-grow h-full outline-none border-none placeholder:font-normal font-normal bg-transparent"
        /> */}
        <Mentions
          style={{ width: "100%", border: "0px" }}
          // onChange={onChange}
          onSelect={(e) => {
            // console.log(e);
            setMentionedUser(e.key);
          }}
          onPressEnter={() => {
            if (!session) {
              message.error("Please login to comment");
              router.replace("/auth/login");
              return;
            }

            message.loading({
              content: "Please wait...",
              key: "comment",
            });

            if (!targetComment) {
              addComment({
                nftId: router.query.nftId,
                userId: session.token.sub,
                text: inputValue,
              }).then((res) => {
                message.success({
                  content: "Comment added",
                  key: "comment",
                });
              });
              setInputValue("");

              root.socket.emit("sendNotification", {
                for: owner ? owner._id : collection.creator._id,
                referenceUser: session.token.sub,
                message: {
                  type: "comment",
                  text: `${
                    root.user?.username || "An User"
                  } commented on your NFT`,
                  link: `/nft/${nft._id}`,
                },
              });

              if (inputValue.includes("@") && mentionedUser) {
                if (!session) {
                  router.replace("/auth/login");
                }
                root.socket.emit("sendNotification", {
                  for: mentionedUser,
                  referenceUser: session.token.sub,
                  message: {
                    type: "mention",
                    text: `${session.session.user.name} mentioned you`,
                    link: `/nft/${nft._id}`,
                  },
                });
              }
            } else {
              addReply({
                nftId: router.query.nftId,
                userId: session.token.sub,
                text: inputValue,
                parentId: targetComment._id,
              });
              setInputValue("");
              if (inputValue.includes("@") && mentionedUser) {
                if (!session) {
                  router.replace("/auth/login");
                }
                root.socket.emit("sendNotification", {
                  for: mentionedUser,
                  referenceUser: session.token.sub,
                  message: {
                    type: "mention",
                    text: `${session.session.user.name} mentioned you`,
                    link: `/nft/${nft._id}`,
                  },
                });
              }
            }
          }}
          onSearch={(text) => {
            // find match for users based on text
            // console.log(text);

            // only pass max 10 users for suggestions
            const filtereddata = users?.filter((user) => {
              if (user?._id === session?.token?.sub) {
                // skip current user
                return false;
              } else {
                return (
                  user.username?.toLowerCase().includes(text?.toLowerCase()) ||
                  user.name?.includes(text)
                );
              }
            });

            const data = filtereddata
              ?.map((user) => {
                return {
                  key: user._id,
                  value: user.username,
                  label: user.username,
                };
              })
              .slice(0, 5);

            setTagOptions(data);
          }}
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            // console.log(e);
            setInputValue(e);
          }}
          placeholder="Leave a comment, @someone to mention them"
          options={tagOptions}
        />

        <div className="flex items-center gap-x-2">
          <Button
            className="w-[32px] h-[32px] rounded-full flex justify-center items-center bg-[#CFDBD540]"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😎
          </Button>
          <Button
            className="w-[65px] h-[36px] font-bold rounded-[6px]"
            type="primary"
            // loading={isLoading}
            onClick={() => {
              if (!session) {
                message.error("Please login to comment");
                router.replace("/auth/login");
                return;
              }

              message.loading({
                content: "Please wait...",
                key: "comment",
              });

              if (!targetComment) {
                addComment({
                  nftId: router.query.nftId,
                  userId: session.token.sub,
                  text: inputValue,
                }).then((res) => {
                  message.success({
                    content: "Comment added",
                    key: "comment",
                  });
                });
                setInputValue("");

                root.socket.emit("sendNotification", {
                  for: owner ? owner._id : collection.creator._id,
                  referenceUser: session.token.sub,
                  message: {
                    type: "comment",
                    text: `${
                      root.user?.username || "An User"
                    } commented on your NFT`,
                    link: `/nft/${nft._id}`,
                  },
                });

                if (inputValue.includes("@") && mentionedUser) {
                  if (!session) {
                    router.replace("/auth/login");
                  }
                  root.socket.emit("sendNotification", {
                    for: mentionedUser,
                    referenceUser: session.token.sub,
                    message: {
                      type: "mention",
                      text: `${session.session.user.name} mentioned you`,
                      link: `/nft/${nft._id}`,
                    },
                  });
                }
              } else {
                addReply({
                  nftId: router.query.nftId,
                  userId: session.token.sub,
                  text: inputValue,
                  parentId: targetComment._id,
                });
                setInputValue("");
                if (inputValue.includes("@") && mentionedUser) {
                  if (!session) {
                    router.replace("/auth/login");
                  }
                  root.socket.emit("sendNotification", {
                    for: mentionedUser,
                    referenceUser: session.token.sub,
                    message: {
                      type: "mention",
                      text: `${session.session.user.name} mentioned you`,
                      link: `/nft/${nft._id}`,
                    },
                  });
                }
              }
            }}
          >
            Post
          </Button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-16 right-0">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              searchDisabled={true}
              theme={theme}
            />
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3 w-full">
        {commentsDataLoading &&
          [1, 2, 3, 4].map((i) => {
            return (
              <Skeleton.Input
                key={i}
                active={true}
                size="large"
                className="w-full mt-2"
                block={true}
              />
            );
          })}
        {!commentsDataLoading &&
          commentsData?.comments
            ?.slice(0, commentPage * 4 + 4)
            .map((comment) => {
              return (
                <SingleComment
                  key={comment._id}
                  comment={comment}
                  inputRef={inputRef}
                  setTargetComment={setTargetComment}
                  setInputValue={setInputValue}
                />
              );
            })}
      </div>

      <div className="w-fit mx-auto mt-10 mb-4 ">
        {commentsData?.comments?.length > 4 &&
          commentPage * 4 + 4 < commentsData?.comments?.length && (
            <Button
              className="w-[118px] h-[43px] rounded-xl font-bold text-sm"
              onClick={() => setCommentPage(commentPage + 1)}
            >
              Load More
            </Button>
          )}
      </div>
    </div>
  );
}
