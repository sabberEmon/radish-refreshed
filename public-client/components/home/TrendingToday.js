import React from 'react'
import Art from '../../images/Art.png';
import Shape from '../../images/Diamond_Shape.png';
import Image from "next/image";

const TrendingCollection = ({ index }) => {
    return (
        <div className="flex justify-between items-center flex-row border-t-0 border-l-0 border-r-0 border-b-2 border-solid border-[#CFDBD599]">
            <div className="py-3 w-full">
                <div className="w-full flex justify-start items-center flex-row gap-4 ">
                    <p className="font-bold text-[14px]">{index}</p>
                    <Image
                        src={Art}
                        width={54}
                        height={54}
                        className="rounded-full"
                    />
                    <div className="w-[100%] flex justify-start items-start flex-col gap-1 ">
                        <p className="font-semibold text-[16px]">Bored Ape Yacht Club</p>
                        <div className='w-full flex justify-between items-center'>
                            <div className="flex justify-start items-center flex-row gap-2">
                                <Image
                                    src={Shape}
                                    width={12.5}
                                    height={20}
                                />
                                <p className="font-thin text-[14px]">0.45 RDS</p>
                            </div>
                            <p className="font-thin text-[16px] text-[#04C976] text-end">+10,00%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrendingCollection