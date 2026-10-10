interface Step {
  label: string;
  index: number;
}

interface StepsIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepsIndicator({ steps, currentStep }: StepsIndicatorProps) {
  return (
    <div className="steps">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index < currentStep ? 'done' : ''} ${
            index === currentStep ? 'active' : ''
          }`}
        >
          <div className="circle">
            {index < currentStep ? (
              '✓'
            ) : (
              index === currentStep ? (
                String(index + 1).padStart(2, '0')
              ) : (
                String(index + 1).padStart(2, '0')
              )
            )}
          </div>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}