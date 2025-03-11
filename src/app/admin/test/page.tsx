'use client'
import { useDestinationStore } from "@/store/destination/useDestinationStore";
import { useEffect } from "react";

export default function DestinationList() {
  const { destinations, loading, error, fetchDestination, deleteDestination } =
    useDestinationStore();

  useEffect(() => {
    fetchDestination();
  }, [fetchDestination]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Destinations</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <ul className="mt-4 space-y-2">
        {destinations.map((dest) => (
          <li key={dest.id} className="border p-2 rounded-md flex justify-between items-center">
            <span>{dest.name}</span>
            <button
              onClick={() => deleteDestination(dest.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
