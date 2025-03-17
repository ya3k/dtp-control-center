type Props = {
    currentStep: number
  }
  
  export function Steps({ currentStep }: Props) {
    const steps = [
      { number: 1, title: "Chọn đơn hàng" },
      { number: 2, title: "Điền thông tin" },
      { number: 3, title: "Thanh toán" },
    ]
  
    return (
      <div className="flex items-center p-4 justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.number <= currentStep ? "bg-core text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.number}
              </div>
              <span className={`text-sm mt-1 ${step.number <= currentStep ? "text-core" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-60 h-0.5 mx-2 ${step.number < currentStep ? "bg-core" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>
    )
  }
  
  