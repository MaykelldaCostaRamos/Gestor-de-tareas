import { Bars3Icon } from "@heroicons/react/24/outline";

export default function LayoutHeader({ title, onOpenSidebar }) {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden">
      <h1 className="text-xl font-semibold">{title}</h1>
      <button onClick={onOpenSidebar}>
        <Bars3Icon className="w-6 h-6 text-gray-600" />
      </button>
    </header>
  );
}
