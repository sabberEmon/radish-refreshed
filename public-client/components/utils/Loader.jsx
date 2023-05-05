import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { ReactComponent as RadishLogo } from "../../images/radish.svg";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 30, color: "#DE345E" }} spin />
);

function Loader() {
  return (
    <main className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* <Spin indicator={antIcon} className="w-38 h-38" size="large"> */}
        <RadishLogo className="w-32 h-32 animate-pulse" />
        {/* </Spin> */}
      </div>
    </main>
  );
}

export default Loader;
