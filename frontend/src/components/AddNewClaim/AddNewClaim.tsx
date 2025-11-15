import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export const AddNewClaim = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step => step + 1);
  const handlePrevious = () => setStep(step => step - 1);

  return (
    <div>
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      
      <button onClick={handlePrevious} disabled={step === 1}>Quay lại</button>
      <button onClick={handleNext} disabled={step === 3}>Tiếp theo</button>
    </div>
  );
};