import Image from "next/image";
import React from "react";

const PendingLoader = () => {
  return (
   <div className="h-3/5 w-full flex  items-center justify-center md:mx-16"> 
       
      <div className="flex h-60 justify-start items-center w-60 breath" >
        <Image
          src="/images/Bucket-icon.svg"
          alt="logo"
          width={600}
          height={300}
          className="w-60 aspect-square opacity-85"
        />

        <p className="group-data-[collapsible=icon]:hidden text-center flex flex-col items-center ">
          <span className="font-bucket text-8xl text-zinc-700">BuCkeT</span>
          <span className="font-master text-6xl tracking-[0.8rem] ml-0.5 text-zinc-600">
            master
          </span>
        </p>
      </div>
   </div>
  );
};

export default PendingLoader;
