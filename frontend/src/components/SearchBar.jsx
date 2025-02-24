import { useForm } from "react-hook-form";
import { UploadIcon, SearchIcon } from "../components/index";

export default function SearchBar({ placeholder = "Create Notes", onSearch, value, onChange }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (onSearch) onSearch(data.searchQuery);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center w-full max-w-3xl m-auto px-4 sm:px-0 transition-all duration-300"
    >
      <div className="flex items-center bg-[#303030] w-full rounded-full p-2 shadow-lg">
        <button type="button" className="w-10 h-10 rounded-full bg-[#424242] flex items-center justify-center">
          <UploadIcon size={20} color={"#fff"} />
        </button>
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
  );
}
