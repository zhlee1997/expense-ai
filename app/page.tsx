"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CloudUpload,
  LibraryBigIcon,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });

  const [prompt, setPrompt] = useState("");

  // prompt result
  // const [result, setResult] = useState("");
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

      console.log(uploaded);
    } else {
      console.error("Upload error:", result.error);
    }
  }

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!inputRef || !inputRef.current) return;

    inputRef.current.click();
  }

  const handleQueryModel = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
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

    console.log(loading);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div>
        <div className="absolute top-[30px] left-[280px] hover:cursor-pointer">
          <ComboboxDemo />
        </div>
        <div className="absolute top-[30px] right-[30px] hover:cursor-pointer">
          <Avatar onClick={handleClickAvatar}>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-1/2">
        <p className="text-2xl mb-6">RAG with your expenses</p>

        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <div>
                <div className="font-bold">{m.role}</div>
                <p>
                  {m.content.length > 0 ? (
                    m.content
                  ) : (
                    <span className="italic font-light">
                      {"calling tool: " + m?.toolInvocations?.[0].toolName}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-3 w-full">
          {/* <form onSubmit={(e) => handleQueryModel(e)}> */}
          <form onSubmit={handleSubmit}>
            <Textarea
              rows={4}
              placeholder="Type your query here"
              // value={prompt}
              value={input}
              // onChange={(e) => setPrompt(e.target.value)}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && "form" in e.target) {
                  console.log("Enter pressed");
                  handleQueryModel(e);
                }
              }}
            />
            <p className="text-sm text-muted-foreground self-start justify-self-start mb-8 mt-1">
              Note: You are using o3-mini model.
            </p>
            <Button
              type="submit"
              className="w-full h-12 text-base"
              // onClick={handleQueryModel}
            >
              Send message
            </Button>
          </form>
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
          <Link href="/library" className="flex flex-1">
            <Button className="flex-1 h-12 text-base bg-white text-primary border border-primary hover:bg-slate-100">
              <LibraryBigIcon /> Docs Library
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const frameworks = [
  {
    value: "next.js",
    label: "Claude 3.7 Sonnet",
  },
  {
    value: "sveltekit",
    label: "OpenAI o3-mini",
  },
  {
    value: "remix",
    label: "OpenAI o1-mini",
  },
  {
    value: "nuxt.js",
    label: "DeepSeek R1",
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select your model..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search framework..." className="h-9" /> */}
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
