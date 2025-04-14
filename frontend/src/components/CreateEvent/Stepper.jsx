import React from "react";
import { motion } from "framer-motion";

const StepCircle = ({ step, current }) => {
	const isActive = step === current;
	const isComplete = step < current;

	const bgColor = isActive ? "bg-blue-600" : isComplete ? "bg-blue-400" : "bg-gray-300";

	return (
		<motion.div
			className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${bgColor} z-10`}
			initial={{ scale: 0.8 }}
			animate={{ scale: 1 }}
			transition={{ duration: 0.3 }}
		>
			{step}
		</motion.div>
	);
};

const Connector = ({ fill }) => {
	return (
		<div className="flex-1 relative h-1 bg-gray-300">
			<motion.div
				className="absolute left-0 top-0 h-1 bg-blue-500 rounded-full"
				initial={{ width: 0 }}
				animate={{ width: fill === "full" ? "100%" : fill === "half" ? "50%" : "0%" }}
				transition={{ duration: 0.6 }}
			/>
		</div>
	);
};

const StepLabel = ({ label }) => (
	<span className="mt-4 text-sm font-medium text-gray-700 text-center w-full">{label}</span>
);

const Stepper = ({ currentStep }) => {
	return (
		<div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
			{/* Top Row: Circles + Connectors */}
			<div className="flex w-full items-center justify-between">
				<StepCircle step={1} current={currentStep} />
				<Connector fill={currentStep > 1 ? "full" : currentStep === 1 ? "half" : "none"} />
				<StepCircle step={2} current={currentStep} />
				<Connector fill={currentStep > 2 ? "full" : currentStep === 2 ? "half" : "none"} />
				<StepCircle step={3} current={currentStep} />
			</div>

			{/* Bottom Row: Labels */}
			<div className="flex w-full justify-between mt-2">
				<StepLabel label="Informations" />
				<StepLabel label="Images" />
				<StepLabel label="Récapitulatif" />
			</div>
		</div>
	);
};

export default Stepper;
