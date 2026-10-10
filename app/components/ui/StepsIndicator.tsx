import Icon from "./Icon";

export type StepItem = {
  label: string;
  description: string;
};

type StepsIndicatorProps = {
  steps: StepItem[];
  currentStep: number;
  onChange?: (step: number) => void;
};

export default function StepsIndicator({
  steps,
  currentStep,
  onChange,
}: StepsIndicatorProps) {
  return (
    <nav className="steps-indicator" aria-label="Agent build steps">
      {steps.map((step, index) => {
        const completed = index < currentStep;
        const active = index === currentStep;
        const content = (
          <>
            <span className={"step-number " + (completed ? "completed" : active ? "active" : "")}>
              {completed ? <Icon name="check" size={14} strokeWidth={2.2} /> : String(index + 1).padStart(2, "0")}
            </span>
            <span className="step-text">
              <span className="step-label">{step.label}</span>
              <span className="step-description">{step.description}</span>
            </span>
          </>
        );

        return onChange ? (
          <button
            key={step.label}
            type="button"
            className={"wizard-step " + (active ? "active" : "") + (completed ? "completed" : "")}
            onClick={() => onChange(index)}
            aria-current={active ? "step" : undefined}
          >
            {content}
          </button>
        ) : (
          <div key={step.label} className={"wizard-step " + (active ? "active" : "") + (completed ? "completed" : "")}>
            {content}
          </div>
        );
      })}
    </nav>
  );
}
