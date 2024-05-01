"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { UploadFile } from "./lib/actions";
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

export default function Home() {
  // State for managing video playback key and mute state.
  const [videoURLs, setVideoURLs] = useState<(string | null)[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    "https://storage.googleapis.com/childrenstory-bucket/gina_inside_TV2_360.mp4"
  );
  const [videoKey, setVideoKey] = useState(Date.now());
  const [videoMuted, setVideoMuted] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageObjectUrl, setImageObjectUrl] = useState("");
  const [eyeblinkUrl, setEyeblinkUrl] = useState("");
  const [poseUrl, setPoseUrl] = useState("");
  const [creditCount, setCreditCount] = useState(3);
  const [fileType, setFileType] = useState("");
  const [fontSize, setFontSize] = useState(10);
  const aspectRatio = 1805 / 1247; // Sabit oran
  const [isCreated, setIsCreated] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showCreditForm, setShowCreditForm] = useState(false);

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
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setVideoMuted(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setVideoUrl(videoURLs[Math.floor(Math.random() * 19)]);
      setVideoKey(Date.now());
    }
  }, [isLoading]);
  const handleClick = async function () {
    if (creditCount > 0) {
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
      setVideoUrl(newUrl);
      setVideoKey(Date.now());
      setIsCreated(true);
    }
  };

  const handleFileUpload = async (event: any, type: string) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      type === "image" && setImageObjectUrl(objectUrl);
      setFileType(file.type.startsWith("image") ? "image" : "video");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadSuccess = await UploadFile(formData);
        if (
          uploadSuccess &&
          typeof uploadSuccess === "object" &&
          uploadSuccess.success
        ) {
          console.log("File uploaded successfully: " + uploadSuccess.url);
          if (type === "image") {
            setImageUrl(uploadSuccess.url);
          } else if (type === "audio") {
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

  const handleDownload = async () => {
    // This assumes `videoUrl` is the URL to the video file.
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
    setCreditCount(creditCount + 1);
  };
  return (
    <div className="h-screen w-full bg-black">
      <div className="max-w-[1000px] mx-auto flex flex-col justify-between h-screen">
        <div className="flex justify-between">
          <div className="flex flex-col items-start mt-5 ">
            <Image
              alt="logo"
              src={"/D47G-dashboard-2x-raygun-logo.png"}
              width={100}
              height={100}
            />

            <p
              className={`text-white text-left`}
              style={{ fontSize: `${fontSize}px` }}
            >
              Upload your image or videoclip, add your audio, choose face
              enhancer, add your pose and that&apos;s it!
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (audioUrl && imageUrl) {
                  handleClick();
                  console.log("submitted");
                }
              }}
              className="space-y-4"
            >
              <div className="w-[300px]">
                <label
                  className={`block font-medium text-white`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  Drop an image file or video.
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  style={{ fontSize: `${fontSize}px` }}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-white`}
                  onChange={(e) => {
                    handleFileUpload(e, "image");
                  }}
                />
              </div>

              <div className="w-[300px]">
                <label
                  style={{ fontSize: `${fontSize}px` }}
                  className={`block font-medium text-white`}
                >
                  Add your audio.
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  style={{ fontSize: `${fontSize}px` }}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-white`}
                  onChange={(e) => {
                    handleFileUpload(e, "audio");
                  }}
                />
              </div>

              <div className="w-[300px]">
                <label
                  style={{ fontSize: `${fontSize}px` }}
                  className={`block font-medium text-white`}
                >
                  Add your eyeblink video or use default.
                </label>
                <input
                  type="file"
                  accept="video/*"
                  style={{ fontSize: `${fontSize}px` }}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-white`}
                  onChange={(e) => {
                    handleFileUpload(e, "video");
                  }}
                />
              </div>

              <div className="w-[300px]">
                <label
                  className={`block text-[10px] font-medium text-white`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  Add your pose (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ fontSize: `${fontSize}px` }}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-white`}
                  onChange={(e) => {
                    handleFileUpload(e, "image");
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleToken}
                  style={{ fontSize: `${fontSize}px` }}
                  className={`text-white border-2 font-bold border-white px-2 py-1`}
                >
                  ADD TOKEN
                </button>
                <div className="px-2 py-1 border-2 border-white text-white">
                  {creditCount < 10 ? `0${creditCount}` : creditCount}
                </div>
                <button
                  onClick={handleClick}
                  style={{ fontSize: `${fontSize}px` }}
                  className={`text-white border-2 font-bold border-white px-2 py-1`}
                >
                  SEND
                </button>
              </div>
            </form>
          </div>
          <div className=" mt-20 z-20">
            <div>
              {imageObjectUrl && !isCreated && (
                <div className="flex flex-col gap-5 items-center">
                  {fileType === "image" ? (
                    <Image
                      alt="Uploaded image"
                      src={imageObjectUrl}
                      width={300}
                      height={300}
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

              {isCreated && videoUrl && (
                <div className="flex flex-col gap-5 items-center">
                  <video
                    src={videoUrl}
                    width="300"
                    height="300"
                    controls
                  ></video>

                  <a
                    href="#"
                    onClick={handleDownload} // Use onClick handler to trigger the download function
                    className="text-white border-2 text-sm font-bold border-white px-2 py-1"
                    style={{ textDecoration: "none" }}
                  >
                    DOWNLOAD
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-[600px] mx-auto flex flex-col items-center justify-center gap-2 mb-10">
          <p className="text-white text-xs">
            While our studio puts on the razzle and dazzle for your creation,
            sit back and watch a complimentary short film brought to you by
            RAYGUN.
          </p>
          <div
            className="mx-auto relative"
            style={{
              width: `${containerWidth}px`,
              height: `${containerHeight}px`,
            }}
          >
            {isLoading && videoUrl ? (
              <video
                src={videoUrl}
                key={videoKey}
                muted={false}
                className="absolute top-4 left-4 z-10 w-[70%] h-auto max-h-full"
                autoPlay
                playsInline
                preload="none"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                className="absolute top-4 left-4 z-10 w-[70%] h-auto max-h-full"
                src="/text_slide.png"
                alt="text slide"
              />
            )}

            <img
              className="absolute top-0 left-0 z-20 w-full h-full"
              src="/NEW_TV_FRAME.png"
              alt="newTv"
            />
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
