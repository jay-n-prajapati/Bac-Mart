import React from "react";
import { MdNavigateNext } from "react-icons/md";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  return (
    nPages > 0 && (
      <div className="mt-6">
        <ul className="flex justify-center space-x-4">
          <li className="bg-[#2590db] text-white rounded-l focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <button
              onClick={goToPrevPage}
              className={`w-full h-full px-2 py-1 ${
                currentPage === 1 ? "bg-[#85c7f7]" : ""
              }`}
              disabled={currentPage === 1}
            >
              <GrPrevious />
            </button>
          </li>
          {pageNumbers.map((pgNumber) => (
            <li
              key={pgNumber}
              className={`rounded focus:outline-none ${
                currentPage === pgNumber
                  ? "bg-[#2590db] text-white"
                  : "border-2 border:[#2590db] text-black"
              }`}
            >
              <button
                className="px-2 py-1"
                onClick={() => setCurrentPage(pgNumber)}
              >
                {pgNumber}
              </button>
            </li>
          ))}
          <li className="bg-[#2590db] text-white  rounded-r focus:outline-none">
            <button
              onClick={goToNextPage}
              className={`w-full h-full px-2 py-1 ${
                currentPage === nPages ? "bg-[#85c7f7]" : ""
              }`}
              disabled={currentPage === nPages}
            >
              <GrNext className="mt-1" />
            </button>
          </li>
        </ul>
      </div>
    )
  );
};

export default Pagination;
