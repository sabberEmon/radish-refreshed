import Image from "next/image";
import currency from "../../images/Diamond_Shape.png";
import { BsCartDash } from "react-icons/bs";
import { useDispatch } from "react-redux";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between my-3">
      <div className="flex items-center gap-x-3 max-w-[70%]">
        <Image
          src={item.picture}
          width={70}
          height={70}
          alt="nft"
          className="rounded-[8px]"
        />
        <div>
          <h6 className="text-sm">{item.title}</h6>
          <p className="text-[11px] mt-1 text-[#0556FA] font-bold">
            {item.parentCollection.title}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-x-1">
          <Image src={currency} width={14} height={14} alt="currency" />
          <span className="text-xs font-extrabold">700 XRD</span>
        </div>

        <BsCartDash
          className="text-[#9CA4AB] cursor-pointer text-lg mt-2 hover:text-red-500 transition-all duration-300 ease-in-out"
          onClick={() =>
            dispatch({ type: "cart/removeFromCart", payload: item })
          }
        />
      </div>
    </div>
  );
}
