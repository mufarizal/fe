import { getStorageUrl } from "../../utils/formatUrl";

export default function FileInput({
  label,
  name,
  onChange,
  value,
  accept = "image/*",
  currentFile = null,
  multiple = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-black mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:border file:border-black file:bg-white file:text-black hover:file:bg-black hover:file:text-white file:cursor-pointer file:transition-colors"
      />
      {currentFile && (
        <a
          href={getStorageUrl(currentFile)}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-black/60 underline mt-1 inline-block"
        >
          Lihat file saat ini
        </a>
      )}
    </div>
  );
}
