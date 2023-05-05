import React from "react";
import Art from "../../images/Art.png";
import Shape from "../../images/Diamond_Shape.png";
import Image from "next/image";

const TrendingCollection = ({ index }) => {
  return (
    <tr>
      <td className="py-2">
        <div className="flex justify-start items-center flex-row gap-4">
          <p className="font-bold text-sm xl:text-sm lg:text-sm">{index}</p>
          <Image src={Art} width={54} height={54} className="rounded-full" />
          <div className="flex justify-start items-start flex-col gap-1">
            <p className="font-semibold text-base xl:text-base lg:text-base ">
              Bored Ape Yacht Club
            </p>
            <div className="flex justify-start items-center flex-row gap-3">
              <Image src={Shape} width={12.5} height={20} />
              <p className="font-thin text-sm sm:text-sm lg:text-base">
                33,457.59{" "}
              </p>
            </div>
          </div>
        </div>
      </td>
      <td className="py-2">
        <p className="hidden sm:block font-thin text-sm xl:text-base lg:text-base text-end">
          5.68 ETH
        </p>
      </td>
      <td className="py-2">
        <p className="hidden sm:block font-thin text-sm xl:text-base lg:text-base text-end">
          5,800.60 ETH
        </p>
      </td>
    </tr>
  );
};

export default TrendingCollection;
