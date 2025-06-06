export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center flex-col h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            <div>Đợi tí đừng vội!!!</div>
        </div>
    );
}