"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface LibraryItem {
  url: string;
  filename: string;
  created_at: string;
}

export default function Library() {
  const [library, setLibrary] = useState<LibraryItem[]>([]);

  useEffect(() => {
    handleQueryTable();
  }, []);

  const handleQueryTable = async () => {
    try {
      const response = await fetch("/api/list-docs");
      if (response.ok) {
        const { data } = await response.json();
        setLibrary(data);
        // console.log("library: ", data);
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="grid grid-cols-4 gap-8 w-5/6 py-8">
        {[...library].map((item, i) => (
          <div key={i.toString()} className="flex flex-col items-center">
            <Image
              className="dark:invert"
              src={item.url}
              alt="Receipt Documents"
              width={180}
              height={38}
              priority
            />
            <p>{item.filename}</p>
            <p>{item.created_at.substring(0, 10)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
