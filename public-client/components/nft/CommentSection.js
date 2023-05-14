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

  return (
    <div className="w-full">
      <div className="h-[64px] rounded-[12px] border border-solid border-[#CFDBD599] flex px-3 relative py-2">
        <Mentions
          style={{ width: "100%", border: "0px" }}
          onSelect={(e) => {
            // console.log(e);
            setMentionedUser(e.key);
          }}
          onPressEnter={() => {
            if (!root.user) {
              message.error("Please login to comment");
              return;
            }

            message.loading({
              content: "Please wait...",
              key: "comment",
            });

            if (!targetComment) {
              addComment({
                nftId: router.query.nftId,
                userId: root.user._id,
                text: inputValue,
              }).then((res) => {
                message.success({
                  content: "Comment added",
                  key: "comment",
                });
              });
              setInputValue("");

              root.socket.emit("save-new-individual-notification", {
                for: owner ? owner._id : collection.creator._id,
                type: "user",
                referenceUser: root.user?._id,
                message: {
                  text: `User, commented on your NFT ${nft.title}`,
                  link: `/nft/${nft._id}`,
                },
              });

              if (inputValue.includes("@") && mentionedUser) {
                root.socket.emit("save-new-individual-notification", {
                  for: mentionedUser,
                  type: "user",
                  referenceUser: root.user?._id,
                  message: {
                    text: `User, mentioned you in a comment on NFT ${nft.title}`,
                    link: `/nft/${nft._id}`,
                  },
                });
              }
            } else {
              addReply({
                nftId: router.query.nftId,
                userId: root.user._id,
                text: inputValue,
                parentId: targetComment._id,
              });
              setInputValue("");
              if (inputValue.includes("@") && mentionedUser) {
                root.socket.emit("save-new-individual-notification", {
                  for: mentionedUser,
                  type: "user",
                  referenceUser: root.user?._id,
                  message: {
                    text: `User, mentioned you in a comment on NFT ${nft.title}`,
                    link: `/nft/${nft._id}`,
                  },
                });
              }
            }
          }}
          onSearch={(text) => {
            const filtereddata = users?.filter((user) => {
              if (user?._id === root.user?._id) {
                // skip current user
                return false;
              } else {
                return user.name?.includes(text);
              }
            });

            const data = filtereddata
              ?.map((user) => {
                return {
                  key: user._id,
                  value: user.name,
                  label: user.name,
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
              if (!root.user) {
                message.error("Please login to comment");
                return;
              }

              message.loading({
                content: "Please wait...",
                key: "comment",
              });

              if (!targetComment) {
                addComment({
                  nftId: router.query.nftId,
                  userId: root.user._id,
                  text: inputValue,
                }).then((res) => {
                  message.success({
                    content: "Comment added",
                    key: "comment",
                  });
                });
                setInputValue("");

                root.socket.emit("save-new-individual-notification", {
                  for: owner ? owner._id : collection.creator._id,
                  type: "user",
                  referenceUser: root.user?._id,
                  message: {
                    text: `User, commented on your NFT ${nft.title}`,
                    link: `/nft/${nft._id}`,
                  },
                });

                if (inputValue.includes("@") && mentionedUser) {
                  root.socket.emit("save-new-individual-notification", {
                    for: mentionedUser,
                    type: "user",
                    referenceUser: root.user?._id,
                    message: {
                      text: `User, mentioned you in a comment on NFT ${nft.title}`,
                      link: `/nft/${nft._id}`,
                    },
                  });
                }
              } else {
                addReply({
                  nftId: router.query.nftId,
                  userId: root.user._id,
                  text: inputValue,
                  parentId: targetComment._id,
                });
                setInputValue("");
                if (inputValue.includes("@") && mentionedUser) {
                  root.socket.emit("save-new-individual-notification", {
                    for: mentionedUser,
                    type: "user",
                    referenceUser: root.user?._id,
                    message: {
                      text: `User, mentioned you in a comment on NFT ${nft.title}`,
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
                  nft={nft}
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
