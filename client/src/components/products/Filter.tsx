"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import SpinAnimation from "../items/SpinAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

interface FilterMasterDetail {
  ten: string;
  ma: string;
  thamso: Array<{
    tengoi: string;
    ma: string;
    url: string;
  }>;
}
export default function Filter() {
  const [filterMasterDetail, setFilterMasterDetail] = useState<
    FilterMasterDetail[]
  >([]);
  const [openFilter, setOnpenFilter] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Init Bootstrap ScrollSpy
  useEffect(() => {
    import("bootstrap").then((bootstrap) => {
      new bootstrap.ScrollSpy(document.body, {
        target: "#navbar-example",
      });
    });
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/content/get-filter"
        );
        setFilterMasterDetail(res.data.filter);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFilter();
  }, []);

  return (
    <div className="border rounded" ref={scrollRef}>
      <button
        className="btn btn-success"
        onClick={() => setOnpenFilter(!openFilter)}
      >
        <FontAwesomeIcon icon={faFilter} />
        Bộ lọc
      </button>
      {openFilter ? (
        <div className="position-absolute z-5 end p-5">
          {filterMasterDetail && filterMasterDetail.length > 0 ? (
            <div className="row bg-white rounded border pb-3">
              {filterMasterDetail.map((item) => (
                <div className="col-md-3" key={`${item.ma}-${item.ten}`}>
                  <div className="">
                    <div className="">
                      <h6 className="">{item.ten}</h6>
                      <select className="form-select">
                        <option value={item.ma}>-- Chọn {item.ten} --</option>
                        {item.thamso.map((ts) => (
                          <option key={ts.ma} value={ts.ma}>
                            {ts.tengoi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SpinAnimation />
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
