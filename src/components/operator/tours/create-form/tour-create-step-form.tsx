import { CheckCircle2 } from "lucide-react"

interface FormStepperProps {
  currentStep: number
}

export function FormStepper({ currentStep }: FormStepperProps) {
  const steps = [
    { id: 1, name: "Thông tin tour" },
    { id: 2, name: "Lịch trình" },
    { id: 3, name: "Vé" },
  ]

  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <span>{step.id}</span>}
            </div>
            <span
              className={`mt-2 text-sm ${
                currentStep >= step.id ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {step.name}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className={`w-20 h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

