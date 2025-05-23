import React, { useState } from "react";
import axiosInstance from "../axios/axios";




const VideoUI:React.FC=()=>{
    const [videoFile,setVideoFile]=useState<File|null>(null)
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [status, setStatus] = useState<string>('Idle');
    const [transcriptSegments, setTranscriptSegments] = useState<string[]>([]);
    const [questionsBySegment, setQuestionsBySegment] = useState<Record<number, string[]>>({});

    
    const splittrancriptintosegment = (transcript: string,secondspersegment:number=15): string[] => {
        const words = transcript.split(' ');
        const wordsPerMinute = 150; // approx 5 minutes at 150wpm
        const wordsPerSegment = Math.round((wordsPerMinute / 60) * secondspersegment);
        const segments = [];
        for (let i = 0; i < words.length; i += wordsPerSegment) {
        segments.push(words.slice(i, i + wordsPerSegment).join(' '));
        }
        return segments;
    };

    const handleVideoUpload=async()=>{
            if(!videoFile) return
              setStatus('Checking Video Duration...');

            // Step 1: Check video duration before upload
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';

            videoElement.onloadedmetadata = async () => {
              window.URL.revokeObjectURL(videoElement.src); // Clean up

              const durationInMinutes = videoElement.duration / 60;

              if (durationInMinutes > 60) {
                setStatus('Error: Video exceeds 60 minutes limit');
                alert('Video duration must be 60 minutes or less.');
                return;
              }

              // Step 2: Proceed with upload if valid
              setStatus('Uploading....');

            const formData=new FormData()
            formData.append('video', videoFile)

            try {
                const response=await axiosInstance.post('/api/upload',formData,{
                    onUploadProgress:(progressEvent)=>{
                        const percentagecal=Math.round((progressEvent.loaded*100)/(progressEvent.total ||1));
                        setUploadProgress(percentagecal)
                    }
                })
                setStatus("Processing Transcript")

                const transcript=response.data.transcript
                const fulltranscruipt:string=transcript
                console.log("transcript",fulltranscruipt)
                const secondspersegment= 15; // Chan
                const segment=splittrancriptintosegment(fulltranscruipt,secondspersegment)
                setTranscriptSegments(segment)


                setStatus("generating questionsssss")
                const questionRespoinse=await axiosInstance.post('/api/questions',{
                    segment,
                    filename:videoFile.name
                })
                setQuestionsBySegment(questionRespoinse.data)

                setStatus('complete')

                
            } catch (error) {
              
                    console.error(error);
                    setStatus('Error occurred');
            }
             
    }

 videoElement.src = URL.createObjectURL(videoFile); // Trigger load
  }
    return (
     <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        🎥 AI Video Transcript & Q&A Generator
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />

          <button
            onClick={handleVideoUpload}
            disabled={!videoFile || status !== "Idle"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition"
          >
            Upload & Process
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
      </div>

      {transcriptSegments.map((segment, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Segment {index + 1}</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">
            {segment}
          </p>

          <h3 className="text-md font-medium text-gray-800 mb-2">📌 Generated Questions:</h3>
          <ul className="list-disc pl-6 text-sm space-y-1 text-gray-700">
            {(questionsBySegment[index] || []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    );
  }

export default VideoUI