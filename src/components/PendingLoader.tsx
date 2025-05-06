import Image from "next/image";
import React from "react";

const PendingLoader = () => {
  return (
   <div className="h-3/5 w-[calc(100vw-2rem)] flex items-center justify-center "> 
     <div className="h-full w-full flex items-center justify-center">    
      <div className="flex  justify-start items-center  breath">
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
   </div>
  );
};

export default PendingLoader;
