"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { UploadFile } from "./lib/actions";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SignInForm from "@/components/SignInForm";
import { Button } from "@/components/ui/button";
import BuyCredit from "@/components/BuyCredit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { tvText } from "./options/text";
export default function Home() {
  const [videoURLs, setVideoURLs] = useState<(string | null)[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>("");
  const [videoKey, setVideoKey] = useState(Date.now());
  const [videoMuted, setVideoMuted] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageObjectUrl, setImageObjectUrl] = useState("");
  const [eyeblinkUrl, setEyeblinkUrl] = useState("");
  const [poseUrl, setPoseUrl] = useState("");
  const [creditCount, setCreditCount] = useState(0);
  const [fileType, setFileType] = useState("");
  const [fontSize, setFontSize] = useState(10);
  const aspectRatio = 1805 / 1247; // Sabit oran
  const [isCreated, setIsCreated] = useState(false);
  const [objectType, setObjectType] = useState("");
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [showBuyCredit, setShowBuyCredit] = useState(false);
  const [inputText, setInputText] = useState("");
  const [waitingVideoUrl, setWaitingVideoUrl] = useState<string | null>("");
  const [gender, setGender] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageObjectType, setImageObjectType] = useState("");

  const { data: session } = useSession();
  useEffect(() => {
    if (isCreated && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isCreated]);

  useEffect(() => {
    console.log("session:");
    console.log(session);
  }, []);
  useEffect(() => {
    if (imageUrl && (inputText || audioUrl)) {
      setIsUploaded(true);
    } else {
      setIsUploaded(false);
    }
  }, [imageUrl, inputText, audioUrl]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const aspectRatio = 1805 / 1247;
      const newHeight = window.innerHeight * 0.3;
      setContainerHeight(newHeight);
      setContainerWidth(newHeight * aspectRatio);

      const handleResize = function () {
        const updatedHeight = window.innerHeight * 0.2;
        setContainerHeight(updatedHeight);
        setContainerWidth(updatedHeight * aspectRatio);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    function adjustFontSize() {
      const newFontSize = window.innerHeight / 100;
      setFontSize(newFontSize);
    }

    window.addEventListener("resize", adjustFontSize);
    adjustFontSize();

    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [window.innerHeight]);
  useEffect(() => {
    handleCredit();
    const fetchData = async function () {
      const res = await fetch("/api/videoData", {
        method: "POST",
      });
      const body = await res.json();
      const urls = body.urls;
      console.log(urls);
      setVideoURLs(urls);
    };
    fetchData();
    getCredit();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setVideoMuted(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setWaitingVideoUrl(videoURLs[Math.floor(Math.random() * 19)]);
      setVideoKey(Date.now());
    }
  }, [isLoading]);

  const getCredit = async function () {
    if (session?.user) {
      console.log(session.user);

      const res = await fetch("/api/getCredit", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
        }),
      });
      const resJSON = await res.json();
      const credit = resJSON.credit;
      setCreditCount(credit);
    } else {
      console.log("not logged in");
    }
  };

  const handleCredit = async function () {
    if (session?.user) {
      console.log(session.user);

      const res = await fetch("/api/createCredit", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
        }),
      });
    } else {
      console.log("not logged in");
    }
  };

  const handleClick = async function () {
    setIsCreated(false);
    if (!session) {
      setShowForm(true);
    }
    if (creditCount > 0 && session) {
      if (inputText) {
        setIsLoading(true);
        const audioRes = await fetch("/api/audio", {
          method: "POST",
          body: JSON.stringify({
            text: inputText,
            gender: gender,
          }),
        });
        const audioJson = await audioRes.json();
        const audio = await audioJson.url;

        const res = await fetch("/api/talk", {
          method: "POST",
          body: JSON.stringify({
            audioUrl: audio,
            imageUrl: imageUrl,
            poseUrl: poseUrl,
            eyeblinkUrl: eyeblinkUrl,
          }),
        });
        const response = await res.json();
        const newUrl = response.url;
        if (newUrl === "error") {
          setIsLoading(false);
          setShowAlert(true);
        } else {
          setVideoUrl(newUrl);
          setVideoKey(Date.now());
          setIsCreated(true);
        }
      } else {
        setIsLoading(true);
        const res = await fetch("/api/talk", {
          method: "POST",
          body: JSON.stringify({
            audioUrl: audioUrl,
            imageUrl: imageUrl,
            poseUrl: poseUrl,
            eyeblinkUrl: eyeblinkUrl,
          }),
        });
        const response = await res.json();
        const newUrl = response.url;
        setIsLoading(false);
        setWaitingVideoUrl("");
        setVideoUrl(newUrl);
        setVideoKey(Date.now());
        setIsCreated(true);
      }
    }
    if (creditCount <= 0 && session) {
      setShowBuyCredit(true);
    }
  };

  const handleFileUpload = async (event: any, type: string) => {
    console.log("handle upload");

    setIsUploaded(false);
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (type === "image") {
        setImageObjectUrl(objectUrl);
        setImageObjectType(file.type.startsWith("image") ? "image" : "video");
      }
      setFileType(file.type.startsWith("image") ? "image" : "video");
      setObjectType(file.type.startsWith("image") ? "image" : "video");
      const formData = new FormData();
      formData.append("file", file);

      try {
        console.log("lets try");
        const uploadSuccess = await UploadFile(formData);
        console.log("upload succes");
        console.log(uploadSuccess);
        if (
          uploadSuccess &&
          typeof uploadSuccess === "object" &&
          uploadSuccess.success
        ) {
          console.log("File uploaded successfully: " + uploadSuccess.url);
          setIsUploaded(true);
          if (type === "image") {
            setImageUrl(uploadSuccess.url);
          } else if (type === "audio") {
            setAudioFile(file);
            setAudioUrl(uploadSuccess.url);
          } else if (type === "video") {
            setEyeblinkUrl(uploadSuccess.url);
          } else if (type === "pose") {
            setPoseUrl(uploadSuccess.url);
          }
        } else {
          console.error("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const clearAudio = () => {
    URL.revokeObjectURL(audioUrl);
    setAudioFile(null);
    setAudioUrl("");

    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob(); // Convert the response to a Blob.
      const downloadUrl = window.URL.createObjectURL(blob); // Create a URL for the Blob.
      const a = document.createElement("a"); // Create a <a> element.
      a.href = downloadUrl;
      a.download = "downloadedVideo.mp4"; // Set the download filename.
      document.body.appendChild(a); // Append the <a> to the document.
      a.click(); // Programmatically click the <a> to trigger the download.
      a.remove(); // Clean up.
      window.URL.revokeObjectURL(downloadUrl); // Revoke the blob URL.
    } catch (error) {
      console.error("Failed to download the file:", error);
    }
  };

  const handleToken = function () {
    setShowBuyCredit(true);
  };
  return (
    <div className="h-screen w-full bg-black overflow-x-hidden">
      {showForm && <SignInForm showForm={showForm} setShowForm={setShowForm} />}
      {showBuyCredit && (
        <BuyCredit
          showBuyCredit={showBuyCredit}
          setShowBuyCredit={setShowBuyCredit}
          creditCount={creditCount}
          setCreditCount={setCreditCount}
        />
      )}
      <AlertDialog open={showAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>an error occurred.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowAlert(false)}>Cancel</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-[800px] mx-auto flex flex-col justify-between h-screen">
        <div className="flex flex-1">
          <div className="flex-1 flex-col items-start mt-5 ">
            <Link href={"https://raygun.ai/"}>
              <Image
                alt="logo"
                src={"/D47G-dashboard-2x-raygun-logo.png"}
                width={100}
                height={100}
              />
            </Link>

            <p
              className={`text-white text-left mb-3`}
              style={{ fontSize: `${fontSize * 1.5}px` }}
            >
              Upload your image or videoclip, add your audio, choose face
              enhancer, add your pose and that&apos;s it!
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-4"
            >
              <div className="w-[300px]">
                <label
                  className={`block font-medium text-white`}
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                >
                  Drop an image file or video.
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-white`}
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      setShowForm(true);
                    }
                  }}
                  onChange={(e) => {
                    handleFileUpload(e, "image");
                  }}
                />
              </div>

              <div className="w-[300px]">
                <label
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  className={`block font-medium text-white`}
                >
                  Add your audio.
                </label>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-white`}
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      setShowForm(true);
                    }
                  }}
                  onChange={(e) => {
                    handleFileUpload(e, "audio");
                  }}
                />
                {audioFile && (
                  <button
                    style={{ fontSize: `${fontSize * 1.3}px` }}
                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md"
                    onClick={clearAudio}
                  >
                    Clear Audio
                  </button>
                )}
              </div>

              <div className="w-[300px]">
                <label
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  className={`block font-medium text-white`}
                >
                  OR write your script and choose a voice for your audio.
                </label>
                <Textarea
                  disabled={audioUrl ? true : false}
                  value={inputText}
                  onChange={(e) => {
                    if (!session) {
                      setShowForm(true);
                    }
                    setInputText(e.target.value);
                  }}
                  className="bg-black resize-none text-xs text-white"
                />
                <Select
                  value={gender}
                  onValueChange={(value) => {
                    console.log(value);
                    setGender(value);
                  }}
                >
                  <SelectTrigger
                    className={"w-[180px] bg-black text-white text-xs mt-3"}
                  >
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="bg-black text-white"
                      value="en-US-Studio-O"
                    >
                      Mary
                    </SelectItem>
                    <SelectItem
                      className="bg-black text-white"
                      value="en-US-Wavenet-G"
                    >
                      Veronica
                    </SelectItem>
                    <SelectItem
                      className="bg-black text-white"
                      value="en-US-Wavenet-H"
                    >
                      Hannah
                    </SelectItem>
                    <SelectItem
                      className="bg-black text-white"
                      value="en-US-Standard-F"
                    >
                      Eve
                    </SelectItem>
                    <SelectItem
                      className="bg-black text-white"
                      value="en-US-Studio-Q"
                    >
                      John
                    </SelectItem>
                    <SelectItem
                      className="bg-black text-white"
                      value="en-US-Wavenet-B"
                    >
                      Matt
                    </SelectItem>
                    <SelectItem
                      className="bg-black text-white"
                      value="en-US-Wavenet-J"
                    >
                      Luke
                    </SelectItem>
                    <SelectItem
                      className="bg-black text-white"
                      value="en-US-Casual-K"
                    >
                      Mark
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[300px]">
                <label
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  className={`block font-medium text-white`}
                >
                  Add your eyeblink video or use default.
                </label>
                <input
                  type="file"
                  accept="video/*"
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-white`}
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      setShowForm(true);
                    }
                  }}
                  onChange={(e) => {
                    handleFileUpload(e, "video");
                  }}
                />
              </div>

              <div className="w-[300px]">
                <label
                  className={`block text-[10px] font-medium text-white`}
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                >
                  Add your pose (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-white`}
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      setShowForm(true);
                    }
                  }}
                  onChange={(e) => {
                    handleFileUpload(e, "pose");
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleToken}
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  className={`text-white border-2 font-bold border-[#c230ff] px-2 py-1`}
                >
                  ADD TOKEN
                </button>
                <div className="px-2 py-1 border-2 border-[#c230ff] text-white">
                  {creditCount < 10 ? `0${creditCount}` : creditCount}
                </div>
                <button
                  onClick={handleClick}
                  style={{ fontSize: `${fontSize * 1.3}px` }}
                  disabled={!isUploaded}
                  className={`${
                    isUploaded ? "text-[#c230ff]" : "text-gray-600"
                  }  border-2 font-bold ${
                    isUploaded ? "border-[#c230ff]" : "border-gray-600"
                  }  px-2 py-1`}
                >
                  ZAP!
                </button>
              </div>
            </form>
          </div>
          <div className="flex flex-1 items-center justify-center z-20 mx-20 my-20 w-full">
            <div>
              {!imageObjectUrl && (
                <div className="flex flex-col gap-5 items-center">
                  <img
                    alt="Uploaded image"
                    src="/magichat.png"
                    className="h-full"
                  />
                </div>
              )}
              {imageObjectUrl && !isCreated && (
                <div className="flex flex-col gap-5 items-center">
                  {imageObjectType === "image" ? (
                    <img
                      alt="Uploaded image"
                      src={imageObjectUrl}
                      className="h-full"
                    />
                  ) : (
                    <video
                      src={imageObjectUrl}
                      width="300"
                      height="300"
                      controls
                    ></video>
                  )}
                </div>
              )}
              {videoUrl && isCreated && (
                <div className="flex flex-col gap-5 items-center">
                  <video
                    src={videoUrl}
                    width="300"
                    height="300"
                    controls
                  ></video>
                </div>
              )}
              {imageObjectUrl && (
                <div className="flex flex-col gap-5 items-center">
                  <button className="mt-5" disabled={videoUrl ? false : true}>
                    <a
                      href="#"
                      onClick={handleDownload}
                      className={`text-sm font-bold  ${
                        videoUrl
                          ? "text-white border-2 border-[#c230ff]"
                          : "text-gray-600 border-2 border-gray-600"
                      } px-2 py-1`}
                      style={{ textDecoration: "none" }}
                    >
                      DOWNLOAD
                    </a>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex-1 flex-col items-center justify-center gap-2 mb-10">
          <div className="flex w-full items-center justify-center h-full">
            <div className="flex-1 mr-10" style={{ flexBasis: "40%" }}>
              <p
                className={`text-white text-left`}
                style={{ fontSize: `${fontSize * 2}px` }}
              >
                {tvText}
              </p>
            </div>
            <div style={{ flexBasis: "60%" }}>
              {" "}
              {/* Video bölümü */}
              <div className="relative flex justify-center">
                {isLoading && waitingVideoUrl ? (
                  <video
                    ref={videoRef}
                    src={waitingVideoUrl}
                    key={videoKey}
                    muted={false}
                    className="absolute top-7 left-[60px] w-[60%] h-[80%]" // videoyu div'in tamamını kaplayacak şekilde ayarlar
                    autoPlay
                    playsInline
                    preload="none"
                  >
                    <source src={waitingVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className="absolute top-10 left-[40px] w-[60%] h-[80%]"
                    src="/magic_slide.png"
                    alt="magic slide"
                  />
                )}
                <img
                  className="relative w-[90%] h-[90%]"
                  src="/NEW_TV_FRAME_BLACKEDGE.png"
                  alt="newTv"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
<video
                  key={videoKey}
                  src={videoUrl}
                  autoPlay
                  muted={videoMuted}
                  className="w-full h-full object-contain"
                  onError={(e) => console.error("Video error:", e)}
                ></video>
*/
