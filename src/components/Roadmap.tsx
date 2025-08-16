import React from "react";

const Roadmap = () => {
  const data = true;

  if (!data) {
    return (
      <div className="text-white">
        No Data
        <span>Want to learn something </span>
      </div>
    );
  }
  return (
    <div className="h-full min-w-full border p-4 rounded-lg ">Roadmap</div>
  );
};

export default Roadmap;
