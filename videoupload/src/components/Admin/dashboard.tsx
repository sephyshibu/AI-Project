import React, { useEffect, useState } from "react";
import axiosInstanceadmin from "../../axios/adminaxios";
import { Dialog, Transition } from "@headlessui/react";
import Header from "./Header";

type Transcript = {
  _id: string;
  transcriptText: string;
  createdAt: string;
  video: string;
};

const AdminTranscriptDashboard: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [editedText, setEditedText] = useState("");

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

  const openModal = (transcript: Transcript) => {
    setSelectedTranscript(transcript);
    setEditedText(transcript.transcriptText);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTranscript(null);
    setEditedText("");
  };

  const handleSave = async () => {
    if (!selectedTranscript) return;

    try {
      const res = await axiosInstanceadmin.patch(`/api/update-transcript/${selectedTranscript._id}`, {
        transcriptText: editedText,
      });

      setTranscripts((prev) =>
        prev.map((t) =>
          t._id === selectedTranscript._id ? { ...t, transcriptText: editedText } : t
        )
      );

      closeModal();
    } catch (err) {
      console.error("Failed to update transcript", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
        <Header/>
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin: All Transcripts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {transcripts.map((item) => (
            <div key={item._id} className="bg-white p-4 shadow rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Transcript ID: {item._id}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Uploaded on: {new Date(item.createdAt).toLocaleString()}
              </p>
              <div className="max-h-60 overflow-y-auto text-sm text-gray-800 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                {item.transcriptText}
              </div>
              <button
                onClick={() => openModal(item)}
                className="mt-2 px-4 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
{isModalOpen && (
  <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <Dialog.Title className="text-lg font-bold">Edit Transcript</Dialog.Title>
        <div className="mt-4">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={10}
            className="w-full p-3 border rounded bg-gray-100 text-sm"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
)}

    </div>
  );
};

export default AdminTranscriptDashboard;
