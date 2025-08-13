"use client";

import { getContactPageContent } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import { fixedInputType } from "@/redux/utils";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ContactForm({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { contact } = useSelector((state: RootState) => state.contents);
  useEffect(() => {
    const fetchContact = async () => {
      try {
        await dispatch(getContactPageContent({ id }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchContact();
  }, [dispatch, id]);
  return (
    <div className="py-2">
      <h4 className="fw-bold text-success border-bottom border-success border-3">
        LIÊN HỆ
      </h4>
      <div className="w-100 d-flex justify-content-center">
        <div className="p-2 w-50">
          <form className="form-control">
            {contact[0]?.data.map((element) => (
              <div key={element.tennhom} className="mb-3">
                <label className="form-label">{element.cauhinh.tieude} </label>
                <input
                  className="form-control"
                  type={fixedInputType(element.cauhinh.kieu)}
                  name={element.tennhom}
                  placeholder={element.cauhinh.huongdan}
                />
              </div>
            ))}
            <div className="mb-3">
              <button className="btn btn-success">
                <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                GỬI
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
