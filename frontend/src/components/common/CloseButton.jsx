import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CloseButton({ onClick, className = "absolute top-4 right-4 text-gray-600" }) {
  return (
    <button onClick={onClick} className={className}>
      <XMarkIcon className="w-6 h-6" />
    </button>
  );
}
