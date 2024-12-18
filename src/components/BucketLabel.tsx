import Image from "next/image";
import Link from "next/link";
import React from "react";

const BucketLabel = () => {
  return (
    <Link
      href={"/"}
      className="flex min-h-20 justify-center items-center px-2 w-full max-sm:gap-8 bg-[#F1F1F1] rounded-lg  sticky top-2"
    >
      <Image
        src="/images/Bucket-icon.svg"
        alt="logo"
        width={90}
        height={50}
        priority
        className="sm:h-32 sm:w-60 max-sm:w-24 max-sm:h-14 object-contain"
      />

      <p className="text-center flex flex-col font-medium  outline-none ring-sidebar-ring text-sidebar-foreground/80">
        <span className="font-bucket sm:text-7xl text-2xl  ">
          BuCkeT
        </span>
        <span className="font-master sm:text-xl text-sm tracking-[0.75rem] ">
          master
        </span>
      </p>
    </Link>
  );
};

export default BucketLabel;
