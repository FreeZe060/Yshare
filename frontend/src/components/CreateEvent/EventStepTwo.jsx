import React, { useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableImage = ({ image, index, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: index });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: transition || "transform 250ms ease",
		zIndex: isDragging ? 50 : 0,
	};

	return (
		<>
			<div className="flex items-center justify-between gap-2">

				<div
					ref={setNodeRef}
					style={style}
					{...attributes}
					{...listeners}
					className="relative w-full border-2 border-dashed border-gray-300 h-48 rounded-lg flex items-center justify-center hover:border-blue-400 transition overflow-hidden group"
				>
					<img
						src={image.preview}
						alt={`img-${index}`}
						className="h-full w-full object-cover pointer-events-none"
					/>
					<motion.button
						whileHover={{ scale: 1.1 }}
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							onRemove(index);
						}}
						className="absolute top-2 right-2 bg-white rounded-full p-1 shadow transition-colors hover:scale-105 z-20"
						onPointerDown={(e) => e.stopPropagation()}
					>
						<X className="w-4 h-4 text-red-600" />
					</motion.button>

				</div>
				<i class="fa-solid fa-arrows-up-down"></i>
			</div>
		</>
	);
};

const EventStepTwo = ({ formData, onChange }) => {
	const inputRef = useRef();
	const images = formData.images || [];

	const sensors = useSensors(useSensor(PointerSensor));

	const handleFiles = (files) => {
		const newImages = Array.from(files).map((file) => ({
			file,
			preview: URL.createObjectURL(file),
		}));
		onChange("images", [...images, ...newImages]);
		inputRef.current.value = null;
	};

	const handleDrop = (e) => {
		e.preventDefault();
		handleFiles(e.dataTransfer.files);
	};

	const removeImage = (index) => {
		const updatedImages = images.filter((_, i) => i !== index);
		onChange("images", updatedImages);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active.id !== over?.id) {
			const newImages = arrayMove(images, active.id, over.id);
			onChange("images", newImages);
		}
	};

	return (
		<div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={images.map((_, index) => index)}
					strategy={verticalListSortingStrategy}
				>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{images.map((img, i) => (
							<SortableImage
								key={i}
								image={img}
								index={i}
								onRemove={removeImage}
							/>
						))}

						{[...Array(5 - images.length)].map((_, i) => (
							<div
								key={`placeholder-${i}`}
								onClick={() => inputRef.current.click()}
								onDrop={handleDrop}
								onDragOver={(e) => e.preventDefault()}
								className="border-2 border-dashed border-gray-300 h-48 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition text-gray-400 text-center"
							>
								Image {images.length + i === 0 ? "principale" : `#${images.length + i + 1}`} <br />
								{images.length + i !== 0 && (
									<span className="text-xs text-gray-300 ml-1">(facultatif)</span>
								)}
							</div>
						))}
					</div>
				</SortableContext>
			</DndContext>

			<input
				type="file"
				accept="image/*"
				multiple
				ref={inputRef}
				className="hidden"
				onChange={(e) => handleFiles(e.target.files)}
			/>
		</div>
	);
};

export default EventStepTwo;