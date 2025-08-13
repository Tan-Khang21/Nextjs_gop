"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const dataArray = [
  {
    id: 1,
    name: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/42f416119282845.609a6f2db08a1.jpg",
  },
  {
    id: 2,
    name: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/3aeaea136865731.6203ec88db3d9.jpg",
  },
  {
    id: 3,
    name: "https://classicaddons.com/wp-content/uploads/2021/09/iphone-12-pro-max-3840x2160-apple-october-2020-event-4k-23066-scaled.jpg",
  },
  {
    id: 4,
    name: "https://www.thermocool.com.ng/wp-content/uploads/2020/12/Long-Air-1536x720.jpg",
  },
  {
    id: 5,
    name: "https://edit.org/photos/img/blog/lsy-customizable-ac-flyer-templates-online.jpg-840.jpg",
  },
  {
    id: 6,
    name: "https://phucanhcdn.com/media/lib/33710_image001.jpg",
  },
  {
    id: 7,
    name: "https://eraj.com/media/wysiwyg/magebig/catalog/04-1418X609.jpg",
  },
  {
    id: 8,
    name: "https://o.aolcdn.com/images/dims?resize=2000,2000,shrink&image_uri=https://s.yimg.com/os/creatr-uploaded-images/2020-03/73515600-6ef3-11ea-9f4f-064b19b6d6f7&client=a1acac3e1b3290917d92&signature=eb9c25548102132b76c0e6cfc4c6b521d4719d06",
  },
];

export default function Banner() {
  const [index, setIndex] = useState(0);

  // Thay đổi index mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % dataArray.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentData = dataArray[index];

  return (
    <div className="py-2">
      <div className="w-100">
        <Image
          src={`${currentData.name}`}
          height={400}
          width={400}
          alt="Banner"
          className="object-fit-cover w-100"
        />
      </div>
    </div>
  );
}
