import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
	/>
);

export default LoadingSpinner;