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
} from "@/components/ui/select-org";
import SignInForm from "@/components/SignInForm";
import { Button } from "@/components/ui/button";
import BuyCredit from "@/components/BuyCredit";
import { Checkbox } from "@/components/ui/checkbox";
import { AiOutlineSound } from "react-icons/ai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
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
import Spinner from "@/components/Spinner";

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
  const [still, setStill] = useState(false);
  const { data: session } = useSession();
  const [fileError, setFileError] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isAudioUrlExist, setIsAudioUrlExist] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hoverMary, setHoverMary] = useState(false);
  const [hoverVeronica, setHoverVeronica] = useState(false);
  const [hoverHannah, setHoverHannah] = useState(false);
  const [hoverEve, setHoverEve] = useState(false);
  const [hoverJohn, setHoverJohn] = useState(false);
  const [hoverMatt, setHoverMatt] = useState(false);
  const [hoverLuke, setHoverLuke] = useState(false);
  const [hoverMark, setHoverMark] = useState(false);
  const [curCharacter, setCurCharacter] = useState("");
  const [isPlayAudio, setIsPlayAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    console.log("clicked:");
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (audioUrl) {
      setIsAudioUrlExist(true);
    } else {
      setIsAudioUrlExist(false);
    }
  }, [audioUrl]);
  useEffect(() => {
    if (imageObjectUrl && !imageUrl) {
      setIsVideoUploading(true);
    } else {
      setIsVideoUploading(false);
    }
  }, [imageObjectUrl, imageUrl]);
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
    if (imageUrl && inputText && !audioUrl) {
      const wordCount = (inputText.match(/\b\w+\b/g) || []).length;
      console.log(wordCount);
      setAudioDuration(Math.ceil(wordCount / 100));
    }

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
    try {
      setIsCreated(false);
      if (!session) {
        setShowForm(true);
      }
      if (creditCount > 0 && session) {
        setCreditCount(creditCount - 1);
        const resCredit = await fetch("/api/useCredit", {
          method: "POST",
          body: JSON.stringify({ userId: session?.user?.id }),
        });

        setIsLoading(true);

        const res = await fetch("/api/generate", {
          method: "POST",
          body: JSON.stringify({
            imageUrl: imageUrl,
            inputText: inputText,
            gender: gender,
            still: still,
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
      if (creditCount <= 0 && session) {
        setShowBuyCredit(true);
      }
    } catch {
      setShowAlert(true);
    }
  };

  const handleClickWithAudio = async function () {
    try {
      setIsCreated(false);
      if (!session) {
        setShowForm(true);
      }
      if (creditCount > 0 && session) {
        setCreditCount(creditCount - 1);
        const resCredit = await fetch("/api/useCredit", {
          method: "POST",
          body: JSON.stringify({ userId: session?.user?.id }),
        });

        setIsLoading(true);

        const res = await fetch("/api/generateWithAudio", {
          method: "POST",
          body: JSON.stringify({
            audioUrl: audioUrl,
            imageUrl: imageUrl,
            gender: gender,
            still: still,
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
      if (creditCount <= 0 && session) {
        setShowBuyCredit(true);
      }
    } catch {
      setShowAlert(true);
    }
  };
  const handleFileUpload = async (event: any, type: string) => {
    console.log("handle upload");

    setIsUploaded(false);
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (type === "image") {
        console.log("filetype:");
        console.log(file.type);
        setImageObjectUrl(objectUrl);
        setImageObjectType(file.type.startsWith("image") ? "image" : "video");
      } else if (type === "audio") {
        const audio = new Audio(objectUrl);
        audio.addEventListener("loadedmetadata", () => {
          setAudioDuration(Math.floor(audio.duration) / 60);
          setAudioFile(file);
        });
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
            setImageUrl(uploadSuccess.url || "");
          } else if (type === "video") {
            setEyeblinkUrl(uploadSuccess.url || "");
          } else if (type === "pose") {
            setPoseUrl(uploadSuccess.url || "");
          } else if (type === "audio") {
            setAudioUrl(uploadSuccess.url || "");
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
    if (session) {
      setShowBuyCredit(true);
    } else {
      setShowForm(true);
    }
  };

  const handleNewAudio = async function (text: string, gender: string) {
    const res = await fetch("/api/audio", {
      method: "POST",
      body: JSON.stringify({
        text: text,
        gender: gender,
      }),
    });
  };

  useEffect(() => {
    if (curCharacter) {
      playAudio();
    }
  }, [curCharacter]);
  const audioPlay = function (
    hoverFunc: any,
    setHoverFunc: any,
    audioCharacter: string,
    character: string
  ) {
    return (
      <div className="relative group ">
        <SelectItem
          onMouseEnter={() => {
            setHoverFunc(true);
          }}
          onMouseLeave={() => {
            setHoverFunc(false);
          }}
          className="bg-black text-white "
          value={audioCharacter}
        >
          <div className="flex justify-between items-center w-full">
            <p>{character}</p>
          </div>
        </SelectItem>
        <Button
          className={`absolute w-max h-max top-0 right-0 bg-transparent hover:bg-transparent focus-visible:none`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setGender(audioCharacter);
            setCurCharacter(audioCharacter);
          }}
        >
          <AiOutlineSound
            className={`${hoverFunc ? "text-black" : "text-white"} w-4 h-4`}
          />
        </Button>
      </div>
    );
  };
  return (
    <div className="h-screen w-full bg-black overflow-x-hidden">
      <audio
        ref={audioRef}
        key={Date.now()}
        src={`voices/${curCharacter}.mp3`}
        onEnded={() => {
          console.log("ended");
        }}
      />

      <AlertDialog open={fileError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setFileError(false);
              }}
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      <div className="max-w-[1000px] mx-auto flex flex-col justify-between h-screen">
        <Link href={"https://raygun.ai/"}>
          <img
            alt="logo"
            src={"/raygunlogo.png"}
            width={150}
            height={150}
            className="my-2"
          />
        </Link>

        <p
          className={`text-white text-left mb-3 w-full`}
          style={{ fontSize: `${fontSize * 2}px` }}
        >
          Upload your image or videoclip and add your audio or text to audio.
          Please make sure your image has good lighting and a clear picture of
          the face, preferably the mouth closed for best results. Choose fewer
          head motion if you would like less animation. Custom eyeblink video
          and pose is optional. LETS TRY
        </p>
        <div className="flex flex-1 ml-5 md:ml-0">
          <div className="flex-1 flex-col items-start mt-3 mb-2 ">
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
                <div className="flex gap-2 items-center">
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
                  {isVideoUploading ? <Spinner /> : ""}
                </div>
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
                {audioFile && audioUrl && (
                  <div>
                    <audio controls>
                      <source src={audioUrl} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                    <button
                      style={{ fontSize: `${fontSize * 1.3}px` }}
                      className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={clearAudio}
                    >
                      Clear Audio
                    </button>
                  </div>
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
                    {audioPlay(
                      hoverMary,
                      setHoverMary,
                      "en-US-Studio-O",
                      "Mary"
                    )}
                    {audioPlay(
                      hoverVeronica,
                      setHoverVeronica,
                      "en-US-Wavenet-G",
                      "Veronica"
                    )}
                    {audioPlay(
                      hoverHannah,
                      setHoverHannah,
                      "en-US-Wavenet-H",
                      "Hannah"
                    )}
                    {audioPlay(
                      hoverEve,
                      setHoverEve,
                      "en-US-Standard-F",
                      "Eve"
                    )}
                    {audioPlay(
                      hoverJohn,
                      setHoverJohn,
                      "en-US-Studio-Q",
                      "John"
                    )}
                    {audioPlay(
                      hoverMatt,
                      setHoverMatt,
                      "en-US-Wavenet-B",
                      "Matt"
                    )}
                    {audioPlay(
                      hoverLuke,
                      setHoverLuke,
                      "en-US-Wavenet-J",
                      "Luke"
                    )}
                    {audioPlay(
                      hoverMark,
                      setHoverMark,
                      "en-US-Casual-K",
                      "Mark"
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[300px]">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={still}
                    onCheckedChange={() => {
                      console.log("current:");
                      console.log(still);
                      setStill(!still);
                    }}
                    className="text-white border-gray-600"
                  />
                  <p className="text-white text-xs">
                    Still (fewer head motion)
                  </p>
                </div>
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
              {isUploaded && (
                <p className="text-white">
                  TOTAL:{" "}
                  {audioDuration > 1
                    ? `${Math.floor(audioDuration)} TOKEN`
                    : "1 TOKEN"}
                </p>
              )}
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
                {!isAudioUrlExist ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("audioUrl:");
                      console.log(audioUrl);

                      handleClick();
                    }}
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
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("audioUrl:");
                      console.log(audioUrl);

                      handleClickWithAudio();
                    }}
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
                )}
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
              {imageObjectUrl && isCreated && (
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
          <div className="flex md:flex-row flex-col w-full items-center justify-center h-full md:mt-0 mt-10">
            <div className="flex-1 mr-10" style={{ flexBasis: "40%" }}>
              <p
                className={`text-white md:text-left text-center`}
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
                    className="absolute top-7 md:left-[60px] left-[50px] w-[60%] h-[80%]" // videoyu div'in tamamını kaplayacak şekilde ayarlar
                    autoPlay
                    playsInline
                    preload="none"
                  >
                    <source src={waitingVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className="absolute md:top-10 top-5 left-[40px] w-[60%] h-[80%]"
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
