import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { UploadIcon, SearchIcon } from "../components/index";
import { X } from "lucide-react"; // Close icon for removing files

export default function SearchBar({ placeholder = "Create Notes", onSearch, value, onChange }) {
  const { register, handleSubmit } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (data) => {
    await uploadFilesToBackend(files);
    if (onSearch) onSearch(data.searchQuery);
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const uploadFilesToBackend = async (files) => {
    setIsUploading(true); // Disable upload button
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setIsUploading(true); // Disable upload button
      setTimeout(() => {
        response.ok = true;
      }, timeout);

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      console.log("Upload successful", result);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false); // Re-enable upload button
    }
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl m-auto">
      {/* Uploaded files list */}
      <div className="mb-3 ml-5 flex flex-wrap gap-2">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center bg-[#303030] text-white px-3 py-2 rounded-lg">
            <span className="mr-2">{file.name}</span>
            <button onClick={() => removeFile(index)} className="text-red-400">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center w-full px-4 sm:px-0 transition-all duration-300"
      >
        <div className="flex items-center bg-[#303030] w-full rounded-full p-2 shadow-lg">
          <label
            htmlFor="file-upload"
            className={`w-10 h-10 rounded-full ${isUploading ? "bg-gray-500 cursor-not-allowed" : "bg-[#424242] cursor-pointer"} flex items-center justify-center`}
          >
            <UploadIcon size={20} color={"#fff"} />
            <input
              id="file-upload"
              type="file"
              accept=".mp3, .wav, .pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          <div className="w-full px-2">
            <input
              type="text"
              {...register("searchQuery")}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="w-full px-4 py-2 h-10 sm:h-12 focus:outline-none text-gray-300 bg-transparent placeholder-gray-400 text-base sm:text-lg"
            />
          </div>
          <button type="submit" className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <SearchIcon size={30} color={"#000"} />
          </button>
        </div>
      </form>
    </div>
  );
}
