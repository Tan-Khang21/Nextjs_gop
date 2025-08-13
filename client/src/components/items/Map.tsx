import React from "react";

export default function Map() {
  return (
    <div className="">
      <h6 className="mx-2 fw-bold text-success border-bottom border-2 border-success">
        MY LOCATION
      </h6>
      <iframe
        className="w-100 px-2"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d979.8048564991161!2d106.63362566946277!3d10.794499299334715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752989ff44b791%3A0x690401319dd06fd8!2zODIgRMOibiBU4buZYywgVMOibiBTxqFuIE5ow6wsIFTDom4gUGjDuiwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1748317034320!5m2!1svi!2s"
        height="450"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
