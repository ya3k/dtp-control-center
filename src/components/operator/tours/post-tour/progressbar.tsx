import useTourStore from "@/store/tourStore";
import { cn } from "@/lib/utils";

interface StepInfo {
  title: string;
  description: string;
}

const stepInfo: Record<number, StepInfo> = {
  1: {
    title: "Thông tin cơ bản",
    description: "Tên tour, mô tả, hình ảnh"
  },
  2: {
    title: "Thông tin thêm",
    description: "Thông tin chi tiết về tour"
  },
  3: {
    title: "Lịch trình",
    description: "Thời gian hoạt động"
  },
  4: {
    title: "Địa điểm",
    description: "Các điểm đến và hoạt động"
  },
  5: {
    title: "Vé",
    description: "Giá vé và loại vé"
  },
  6: {
    title: "Xem lại",
    description: "Kiểm tra thông tin"
  }
};

const Circle = ({
  step,
  currentIndex,
}: {
  step: number;
  currentIndex: number;
}) => {
  const info = stepInfo[currentIndex];
  const isActive = step === currentIndex;
  const isCompleted = step > currentIndex;
  const isPending = step < currentIndex;

  return (
    <div className="flex flex-col items-center relative group">
      <div
        className={cn(
          "w-14 h-10 flex items-center justify-center rounded-full transition-all duration-300",
          "border-2 font-medium text-sm",
          isActive && "border-teal-500 text-teal-500 border-4 scale-110",
          isCompleted && "bg-teal-500 border-teal-500 text-white",
          isPending && "border-gray-300 text-gray-500"
        )}
      >
        {isCompleted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          currentIndex
        )}
      </div>
      
      <div className="absolute -bottom-16 w-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white shadow-lg rounded-lg p-2 text-center z-10">
        <p className="font-medium text-sm text-gray-900">{info.title}</p>
        <p className="text-xs text-gray-500">{info.description}</p>
      </div>

      <span className={cn(
        "text-sm font-medium mt-2 transition-colors duration-300",
        isActive && "text-teal-500",
        isCompleted && "text-teal-500",
        isPending && "text-gray-500"
      )}>
        {info.title}
      </span>
    </div>
  );
};

function ProgressBar() {
  const { step, getTotalSteps } = useTourStore();
  const totalSteps: number = getTotalSteps();

  return (
    <div className="relative pt-2 pb-20">
      <div className="flex mx-auto justify-between w-4/5 max-w-4xl">
        {[...Array(totalSteps - 1)].map((_, idx) => (
          <div key={idx} className="flex items-center w-full">
            <Circle step={step} currentIndex={idx + 1} />
            <div className="flex-grow h-[2px] relative mx-2">
              <div className="absolute top-0 left-0 h-full w-full bg-gray-200" />
              <div
                className={cn(
                  "absolute top-0 left-0 h-full bg-teal-500",
                  "transition-all duration-500 ease-in-out origin-left",
                  step > idx + 1 ? "w-full" : "w-0"
                )}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center">
          <Circle step={step} currentIndex={totalSteps} />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;