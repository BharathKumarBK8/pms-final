"use client";
import { useEffect, useState, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

interface Media {
  id: number;
  originalName: string;
  path: string;
}

export default function MediaSection({
  patientId,
  casesheetId,
  title = "Media Files",
}: {
  patientId?: string;
  casesheetId?: string;
  title?: string;
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showUploadButtons, setShowUploadButtons] = useState(false);
  const fileUploadRef = useRef<FileUpload>(null);
  const toast = useRef<Toast>(null);

  const fetchMedia = async () => {
    try {
      const params = new URLSearchParams();
      if (patientId) params.append("patientId", patientId);
      if (casesheetId) params.append("casesheetId", casesheetId);

      const res = await fetch(`http://localhost:5000/api/media?${params}`);
      if (res.ok) {
        setMedia(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [patientId, casesheetId]);

  const customUpload = async (event: any) => {
    const files = event.files;
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        if (patientId) formData.append("patientId", patientId);
        if (casesheetId) formData.append("casesheetId", casesheetId);

        return fetch("http://localhost:5000/api/media", {
          method: "POST",
          body: formData,
        });
      });

      await Promise.all(uploadPromises);
      await fetchMedia();
      fileUploadRef.current?.clear();
      setShowUploadButtons(false);

      toast.current?.show({
        severity: "success",
        summary: "Upload Successful",
        detail: `${files.length} file(s) uploaded successfully`,
        life: 3000,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Upload Failed",
        detail: "Please try again",
        life: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/media/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchMedia();
        toast.current?.show({
          severity: "info",
          summary: "Image Deleted",
          detail: "Image has been removed",
          life: 2000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Delete Failed",
        detail: "Unable to delete image",
        life: 2000,
      });
    }
  };

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setZoomLevel(1);
    setGalleryVisible(true);
  };

  const navigateImage = (direction: "next" | "prev") => {
    setZoomLevel(1);
    if (direction === "next") {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    }
  };

  const handleZoom = (type: "in" | "out" | "reset") => {
    if (type === "in") {
      setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    } else if (type === "out") {
      setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
    } else {
      setZoomLevel(1);
    }
  };

  const getCurrentFileName = () => {
    return media[currentIndex]?.originalName || "Image";
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />

      <Card className="shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {media.length} files
          </span>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200">
            <FileUpload
              ref={fileUploadRef}
              mode="advanced"
              multiple
              accept="image/*"
              customUpload
              uploadHandler={customUpload}
              disabled={uploading}
              auto={false}
              chooseLabel="Select Images"
              uploadLabel={uploading ? "Uploading..." : "Upload"}
              cancelLabel="Cancel"
              chooseOptions={{
                icon: "pi pi-plus",
                className: "p-button-outlined p-button-primary",
              }}
              uploadOptions={{
                icon: uploading ? "pi pi-spin pi-spinner" : "pi pi-upload",
                className: "p-button-success",
                style: { display: showUploadButtons ? "inline-flex" : "none" },
              }}
              cancelOptions={{
                icon: "pi pi-times",
                className: "p-button-secondary",
                style: { display: showUploadButtons ? "inline-flex" : "none" },
              }}
              onSelect={() => setShowUploadButtons(true)}
              onClear={() => setShowUploadButtons(false)}
              emptyTemplate={
                <div className="text-center">
                  <i className="pi pi-cloud-upload text-6xl text-gray-400 mb-4"></i>
                  <p className="text-lg text-gray-600 mb-2 font-medium">
                    Drag and drop images here
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse files • JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              }
            />
          </div>
        </div>

        {/* Images Grid */}
        {media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {media.map((item, index) => (
              <div key={item.id} className="group relative">
                <div
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => openGallery(index)}
                >
                  <img
                    src={`http://localhost:5000${item.path}`}
                    alt={item.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
                </div>
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={(e) => handleDelete(item.id, e)}
                  rounded
                  size="small"
                  tooltip="Delete image"
                  tooltipOptions={{ position: "left" }}
                />
                <p
                  className="text-xs text-gray-600 mt-2 truncate font-medium"
                  title={item.originalName}
                >
                  {item.originalName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <i className="pi pi-images text-6xl mb-4 text-gray-300"></i>
            <p className="text-lg font-medium mb-2">No images uploaded yet</p>
            <p className="text-sm">Upload your first image to get started</p>
          </div>
        )}
      </Card>

      {/* Gallery Dialog with Carousel and Zoom */}
      <Dialog
        visible={galleryVisible}
        onHide={() => setGalleryVisible(false)}
        modal
        showHeader
        header={getCurrentFileName()}
        className="w-11/12 md:w-5/6 lg:w-4/5"
        contentClassName="p-0"
        maximizable
      >
        <div className="relative bg-gray-900">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              icon="pi pi-search-plus"
              className="p-button-rounded p-button-secondary p-button-sm"
              onClick={() => handleZoom("in")}
              disabled={zoomLevel >= 3}
              tooltip="Zoom In"
            />
            <Button
              icon="pi pi-search-minus"
              className="p-button-rounded p-button-secondary p-button-sm"
              onClick={() => handleZoom("out")}
              disabled={zoomLevel <= 0.5}
              tooltip="Zoom Out"
            />
            <Button
              icon="pi pi-refresh"
              className="p-button-rounded p-button-secondary p-button-sm"
              onClick={() => handleZoom("reset")}
              tooltip="Reset Zoom"
            />
          </div>

          {/* Main Image */}
          <div className="flex justify-center items-center min-h-96 p-4 overflow-auto">
            <img
              src={`http://localhost:5000${media[currentIndex]?.path}`}
              alt={getCurrentFileName()}
              className="max-w-none transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel})`,
                maxHeight: zoomLevel === 1 ? "70vh" : "none",
                cursor: zoomLevel > 1 ? "grab" : "default",
              }}
            />
          </div>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <Button
                icon="pi pi-chevron-left"
                className="p-button-rounded p-button-lg absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-0 text-white hover:bg-black/70"
                onClick={() => navigateImage("prev")}
                tooltip="Previous Image"
              />
              <Button
                icon="pi pi-chevron-right"
                className="p-button-rounded p-button-lg absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-0 text-white hover:bg-black/70"
                onClick={() => navigateImage("next")}
                tooltip="Next Image"
              />
            </>
          )}

          {/* Thumbnails */}
          {media.length > 1 && (
            <div className="bg-black/80 p-4">
              <div className="flex justify-center gap-2 overflow-x-auto max-w-full">
                {media.map((item, index) => (
                  <img
                    key={item.id}
                    src={`http://localhost:5000${item.path}`}
                    alt={item.originalName}
                    className={`w-16 h-16 object-cover rounded cursor-pointer transition-all duration-200 ${
                      index === currentIndex
                        ? "opacity-100 ring-2 ring-blue-500 scale-110"
                        : "opacity-60 hover:opacity-80"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Image Counter */}
          {media.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} of {media.length}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
