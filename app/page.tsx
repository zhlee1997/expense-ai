"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloudUpload, LibraryBigIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  // prompt result
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState("");
  // const [tableData, setTableData] = useState();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("/api/list-tables");
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("data: ", data);
  //       setTableData(data);
  //     } else {
  //       console.error("Failed to fetch data:", response.statusText);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleClickAvatar = () => {
    console.log("Avatar clicked");
  };

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];

    // use the file
    // console.log(file.name);

    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Uploaded file URL:", result.url);
      setUploaded(result.url);
    } else {
      console.error("Upload error:", result.error);
    }
  }

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!inputRef || !inputRef.current) return;

    inputRef.current.click();
  }

  const handleQueryModel = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const result = await fetch("/api/query", {
        method: "POST",
        body: JSON.stringify(prompt),
      });
      const json = await result.json();
      console.log("result: ", json);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
    setPrompt("");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="absolute top-[30px] right-[30px] hover:cursor-pointer">
        <Avatar onClick={handleClickAvatar}>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col items-center gap-4 w-1/2">
        <p className="text-2xl mb-6">RAG with your expenses</p>
        <div className="flex flex-col space-y-3 w-full">
          <Textarea
            rows={5}
            placeholder="Type your query here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text-sm text-muted-foreground self-start justify-self-start mb-14">
            You will query against OpenAI-o3-mini model.
          </p>
          <Button className="w-full h-12 text-base" onClick={handleQueryModel}>
            Send message
          </Button>
        </div>
        <div className="flex gap-x-4 w-full">
          <form className="flex flex-1">
            <Button
              onClick={handleButtonClick}
              className="flex-1 h-12 text-base bg-white text-primary border border-primary hover:bg-slate-100"
            >
              <CloudUpload /> Upload Your Docs
            </Button>
            <input
              ref={inputRef}
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </form>
          <Button className="flex-1 h-12 text-base bg-white text-primary border border-primary hover:bg-slate-100">
            <LibraryBigIcon /> Docs Library
          </Button>
        </div>
      </div>
    </div>
  );
}
