"use client";
import { useEffect, useState, useRef } from "react";

interface Media {
  id: number;
  originalName: string;
  path: string;
}

export default function MediaSection({
  patientId,
  treatmentId,
  title = "Media",
}: {
  patientId?: string;
  treatmentId?: string;
  title?: string;
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Fetch uploaded media */
  const fetchMedia = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (patientId) params.append("patientId", patientId);
    if (treatmentId) params.append("treatmentId", treatmentId);

    const res = await fetch(`http://localhost:5000/api/media?${params}`);
    setMedia(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [patientId, treatmentId]);

  /* Handle file selection */
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* Drag-and-drop */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /* Upload */
  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      patientId && formData.append("patientId", patientId);
      treatmentId && formData.append("treatmentId", treatmentId);

      await fetch("http://localhost:5000/api/media", {
        method: "POST",
        body: formData,
      });
    }

    setSelectedFiles([]);
    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this file?")) return;
    await fetch(`http://localhost:5000/api/media/${id}`, { method: "DELETE" });
    fetchMedia();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      {/* Drag-and-drop / custom button */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-gray-500 transition"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {!selectedFiles.length && (
            <button
              type="button"
              onClick={openFileDialog}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Select Images
            </button>
          )}
          {selectedFiles.length > 0 && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className={`bg-green-600 text-white px-3 py-1 rounded ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
            >
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} file${
                    selectedFiles.length > 1 ? "s" : ""
                  }`}
            </button>
          )}
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </div>

      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-4 mt-4">
          <p className="text-sm font-medium mb-2">Selected files:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="border rounded p-1 relative flex flex-col items-center text-center"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-24 w-24 object-cover rounded mb-1 cursor-pointer"
                  onClick={() => setLightbox(URL.createObjectURL(file))}
                />
                <span className="text-xs truncate w-24">{file.name}</span>
                <button
                  onClick={() => handleRemoveSelected(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded media grid */}
      {!loading && media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((m) => (
            <div
              key={m.id}
              className="relative border rounded overflow-hidden group"
            >
              <img
                src={`http://localhost:5000${m.path}`}
                alt={m.originalName}
                className="w-full h-32 object-cover cursor-pointer"
                onClick={() => setLightbox(`http://localhost:5000${m.path}`)}
              />
              <button
                onClick={() => handleDelete(m.id)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
              >
                Delete
              </button>
              <div className="p-1 text-xs text-center truncate">
                {m.originalName}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && media.length === 0 && selectedFiles.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No media uploaded.</p>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
        >
          <div className="relative">
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded px-2 py-1 hover:bg-opacity-75"
            >
              ✕
            </button>
            <img
              src={lightbox}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
