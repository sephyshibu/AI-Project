
import React, { useState } from "react";
import axiosInstance from "../axios/axios";
import Header from "./Header";

type Option = { label: string; text: string };
type Question = { question: string; options: Option[]; answer: string };

const VideoUI: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>("Idle");
  const[transcript,setranscript]=useState<string>('')
  const [transcriptSegments, setTranscriptSegments] = useState<string[]>([]);
  const [questionsBySegment, setQuestionsBySegment] = useState<Record<number, Question[]>>({});
  const [visibleSegmentCount, setVisibleSegmentCount] = useState(0);

  const splitTranscriptIntoSegments = (transcript: string, secondsPerSegment: number = 15): string[] => {
    const words = transcript.split(" ");
    const wordsPerMinute = 150;
    const wordsPerSegment = Math.round((wordsPerMinute / 60) * secondsPerSegment);
    const segments = [];
    for (let i = 0; i < words.length; i += wordsPerSegment) {
      segments.push(words.slice(i, i + wordsPerSegment).join(" "));
    }
    return segments;
  };
  const handleDownloadJSON = () => {
      const dataStr = JSON.stringify(questionsBySegment, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quiz_data.json";
      a.click();
      URL.revokeObjectURL(url);
    };


  const handleVideoUpload = async () => {
    if (!videoFile) return;

    setStatus("Checking Video Duration...");

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(videoElement.src);
      const durationInMinutes = videoElement.duration / 60;

      if (durationInMinutes > 60) {
        setStatus("Error: Video exceeds 60 minutes limit");
        alert("Video duration must be 60 minutes or less.");
        return;
      }

      setStatus("Uploading...");
      const formData = new FormData();
      formData.append("video", videoFile);

      try {
        const response = await axiosInstance.post("/api/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(percent);
          },
        });

        const fullTranscript: string = response.data.transcript;
        setranscript(fullTranscript)
        const segments = splitTranscriptIntoSegments(fullTranscript, 15);
        setTranscriptSegments(segments);
        setStatus("Processing segments...");

        // Sequentially process each segment
        for (let i = 0; i < segments.length; i++) {
          setStatus(`Generating questions for segment ${i + 1}...`);
          const res = await axiosInstance.post("/api/questions", {
            segment: [segments[i]],
            filename: videoFile.name,
          });

          let questions;
          if (typeof res.data === "string") {
            try {
              questions = JSON.parse(res.data);
            } catch {
              questions = [];
            }
          } else {
            // Backend returns { "0": [...] }
            // So get first value (only one key)
            const values = Object.values(res.data);
            questions = Array.isArray(values[0]) ? values[0] : [];
          }

          setQuestionsBySegment((prev) => ({
            ...prev,
            [i]: questions,
          }));
          setVisibleSegmentCount((prev) => prev + 1);
        }


        setStatus("Complete");

      } catch (err) {
        console.error(err);
        setStatus("Error occurred");
      }
    };

    videoElement.src = URL.createObjectURL(videoFile);
  };

  return (
    <>
     <Header/>
 
    <div className="max-w-6xl mx-auto px-6 py-10">
     
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        AI Video Transcript & Q&A Generator
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" // Styled file input
          />
          <button
            onClick={handleVideoUpload}
            disabled={!videoFile || status !== "Idle"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition"
          >
            Upload File {/* Changed button text */}
          </button>
        </div>

        {uploadProgress > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 mb-1">Upload Progress: {uploadProgress}%</p>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <p className="text-sm font-semibold mt-4 text-gray-800">
          Status: <span className="text-blue-600">{status}</span>
        </p>
        {Object.keys(questionsBySegment).length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleDownloadJSON}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            📥 Download Quiz JSON
          </button>
        </div>
      )}
      </div>

      {transcript && (
        <div className="flex flex-col lg:flex-row gap-6 bg-white shadow rounded-lg p-6 mb-8 border border-gray-100">
          {/* Left: Transcript */}
          <div className="lg:w-1/2 w-full">
            <h2 className="text-xl font-semibold text-blue-700 mb-3">📝 Transcript</h2>
            <div className="max-h-[500px] overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap leading-relaxed p-3 bg-gray-50 rounded">
              {transcript}
            </div>
          </div>

          {/* Right: Segments & Questions */}
           <div className="lg:w-1/2 w-full space-y-6">
              {transcriptSegments.slice(0, visibleSegmentCount).map((segment, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-md font-semibold text-blue-600 mb-2">
                    Segment {index + 1}
                  </h3>

                  {/* Render questions for this segment */}
                 <ul className="space-y-4 list-disc pl-6 text-sm text-gray-800">
                  {Array.isArray(questionsBySegment[index]) ? (
                    questionsBySegment[index].map((q, qi) => (
                      <li key={qi}>
                        <div className="font-medium mb-1">{q.question}</div>
                        <ul className="list-none pl-4 space-y-1">
                          {q.options.map((opt, oi) => (
                            <li key={oi}>
                              <span className="font-semibold">{opt.label}.</span> {opt.text}
                            </li>
                          ))}
                        </ul>
                        <div className="text-green-600 mt-1 text-sm">
                          ✅ Correct Answer: {q.answer}
                        </div>
                      </li>
                    ))
                  ) : (
                    <p>Loading questions...</p>
                  )}
                </ul>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoUI;