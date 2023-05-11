import { Tabs, Dropdown, Button, Empty } from "antd";
import { BsFilter } from "react-icons/bs";
import ProfileListNfts from "./ProfileListNfts";

export default function ProfileMain({ data }) {
  const tabItems = [
    {
      key: "5",
      label: <span className="font-bold">Favourites</span>,
      children: (
        <ProfileListNfts
          // nfts={data.user.favouriteNfts}
          nfts={[]}
          tabName={"favourites"}
        />
      ),
    },
    {
      key: "3",
      label: <span className="font-bold">Created</span>,
      children: (
        <>
          {[].length > 0 ? (
            <div className="min-h-[55vh]">
              <></>
            </div>
          ) : (
            <div className="min-h-[70vh]">
              <Empty
                description="No created collections"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </>
      ),
    },
    {
      key: "4",
      label: <span className="font-bold">Owned</span>,
      children: <ProfileListNfts nfts={data.ownedNfts} tabName={"owned"} />,
    },
    {
      key: "2",
      label: <span className="font-bold">On Sale</span>,
      children: <ProfileListNfts nfts={data.onSaleNfts} tabName={"sale"} />,
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
    },
  ];

  const operations = (
    <Dropdown
      className="hidden md:block"
      menu={{ items }}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <Button className="w-[126px] h-[36px] rounded-full font-bold">
        <div className="flex justify-center items-center gap-1.5 text-sm">
          <BsFilter className="w-[20px] h-[20px]" />
          Apply filter
        </div>
      </Button>
    </Dropdown>
  );

  return (
    <div className="py-5 profile-tabs-list w-full">
      <Tabs
        defaultActiveKey="5"
        items={tabItems}
        size="large"
        tabBarGutter={40}
        tabBarExtraContent={operations}
        // style={{ height: 220 }}
      />
    </div>
  );
}
