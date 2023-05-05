import { Typography } from 'antd';

const { Paragraph } = Typography;

export default function WalletNumber({
  walletNumber = "rdx1qsp8ct65zlammfw40flg3fwc0pfudsrl5y4wzng3fk74ufujzem3q2sqf8amu",
  style = "text-sm text-[#979797]",
}) {
  return (
    <Paragraph className={`${style} wallet-number`} copyable={{ text: walletNumber }}>
      {walletNumber.slice(0, 8) + "..." + walletNumber.slice(-4)}
    </Paragraph>
  );
}
