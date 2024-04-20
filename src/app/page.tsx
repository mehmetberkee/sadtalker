"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
export default function Home() {
  // State for managing video playback key and mute state.
  const [videoKey, setVideoKey] = useState(Date.now());
  const [videoMuted, setVideoMuted] = useState(true);

  // Use an effect to unmute the video after a delay.
  useEffect(() => {
    setTimeout(() => {
      setVideoMuted(false);
    }, 1000); // Unmute after 1 second.
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between">
          <div className="flex flex-col items-start justify-center p-4">
            <Image
              alt="logo"
              src={"/D47G-dashboard-2x-raygun-logo.png"}
              width={200}
              height={200}
            />
            <p className="text-white text-left">
              Upload your image or videoclip, add your audio, choose face
              enhancer, add your pose and that's it!
            </p>
            <form className="space-y-4">
              <div className="w-[300px]">
                <label className="block text-sm font-medium text-white">
                  Drop an image file or video.
                </label>
                <input
                  type="file"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="w-[300px]">
                <label className="block text-sm font-medium text-white">
                  Add your audio.
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="w-[300px]">
                <label className="block text-sm font-medium text-white">
                  Choose a face enhancer.
                </label>
                <select className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm">
                  <option>Enhancer 1</option>
                  <option>Enhancer 2</option>
                  <option>Enhancer 3</option>
                </select>
              </div>

              <div className="w-[300px]">
                <label className="block text-sm font-medium text-white">
                  Add your eyeblink video or use default.
                </label>
                <input
                  type="file"
                  accept="video/*"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="w-[300px]">
                <label className="block text-sm font-medium text-white">
                  Add your pose (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </form>
          </div>
          <div
            className="relative mt-20 z-20"
            style={{ height: "370px", width: "80%" }}
          >
            <div className="absolute top-0 left-0 w-full h-full z-10">
              <img alt="rayguntv" src={"/RAYGUN_TV_LOGO.png"} />
            </div>
            <div
              className="z-0 absolute left-1/2 -translate-x-1/2 flex justify-center aspect-[16/9]"
              style={{
                top: "calc(102/800 * 100%)",
                height: "calc(250/300 * 100%)",
                left: "calc(70/200 * 100%)",
                transform: "translate(-50%)",
              }}
            >
              <video
                key={videoKey}
                src="https://storage.googleapis.com/childrenstory-bucket/gina_inside_TV.mp4"
                autoPlay
                muted={videoMuted}
                className="w-full h-full object-cover"
                onError={(e) => console.error("Video error:", e)}
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
