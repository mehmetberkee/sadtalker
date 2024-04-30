"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { UploadFile } from "./lib/actions";

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
  };

  const handleFileUpload = async (event: any, type: string) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageObjectUrl(objectUrl);
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

  return (
    <div className="h-screen w-full bg-black">
      <div className="max-w-[1000px] mx-auto flex flex-col h-screen">
        <div className="flex justify-between">
          <div className="flex flex-col items-start mt-5 ">
            <Image
              alt="logo"
              src={"/D47G-dashboard-2x-raygun-logo.png"}
              width={100}
              height={100}
            />

            <p className="text-white text-left text-xs">
              Upload your image or videoclip, add your audio, choose face
              enhancer, add your pose and that's it!
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
                <label className="block text-xs font-medium text-white">
                  Drop an image file or video.
                </label>
                <input
                  type="file"
                  className="mt-1 p-2 text-xs w-full border border-gray-300 rounded-md shadow-sm text-white"
                  onChange={(e) => {
                    handleFileUpload(e, "image");
                  }}
                />
              </div>

              <div className="w-[300px]">
                <label className="block text-xs font-medium text-white">
                  Add your audio.
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  className="mt-1 p-2 text-xs w-full border border-gray-300 rounded-md shadow-sm text-white"
                  onChange={(e) => {
                    handleFileUpload(e, "audio");
                  }}
                />
              </div>

              <div className="w-[300px]">
                <label className="block text-xs font-medium text-white">
                  Choose a face enhancer.
                </label>
                <select className="mt-1 p-2 text-xs w-full border border-gray-300 rounded-md shadow-sm">
                  <option>Enhancer 1</option>
                  <option>Enhancer 2</option>
                  <option>Enhancer 3</option>
                </select>
              </div>

              <div className="w-[300px]">
                <label className="block text-xs font-medium text-white">
                  Add your eyeblink video or use default.
                </label>
                <input
                  type="file"
                  accept="video/*"
                  className="mt-1 p-2 text-xs w-full border border-gray-300 rounded-md shadow-sm text-white"
                  onChange={(e) => {
                    handleFileUpload(e, "video");
                  }}
                />
              </div>

              <div className="w-[300px]">
                <label className="block text-xs font-medium text-white">
                  Add your pose (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 p-2 text-xs w-full border border-gray-300 rounded-md shadow-sm text-white"
                  onChange={(e) => {
                    handleFileUpload(e, "image");
                  }}
                />
              </div>
              <button className="text-white">Send</button>
            </form>
          </div>
          <div className=" mt-20 z-20">
            <div>
              {imageObjectUrl && (
                <Image
                  alt="image"
                  width={300}
                  height={300}
                  src={imageObjectUrl}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto">
          <Image
            alt="newTv"
            src={"/NEW_TV_FRAME.png"}
            width={200}
            height={100}
          />
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
