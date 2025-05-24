// components/AdminTranscriptDashboard.tsx
import React, { useEffect, useState } from "react";
import axiosInstanceadmin from "../../axios/adminaxios";

type Transcript = {
  _id: string;
  filename: string;
  transcript: string;
  createdAt: string;
};

const AdminTranscriptDashboard: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const res = await axiosInstanceadmin.get("/api/all-transcripts");
        setTranscripts(res.data);
      } catch (err) {
        console.error("Error fetching transcripts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin: All Transcripts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {transcripts.map((item) => (
            <div key={item._id} className="bg-white p-4 shadow rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">{item.filename}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Uploaded on: {new Date(item.createdAt).toLocaleString()}
              </p>
              <div className="max-h-60 overflow-y-auto text-sm text-gray-800 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                {item.transcript}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTranscriptDashboard;
