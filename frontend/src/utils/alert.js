import Swal from 'sweetalert2';

export function showConfirmation({ title, text, icon = 'warning', confirmText = 'Confirmer' }) {
	return Swal.fire({
		title,
		text,
		icon,
		showCancelButton: true,
		confirmButtonText: confirmText,
		cancelButtonText: 'Annuler',
	});
}

export async function showStatusSelection(currentStatus, options = []) {
	if (!Array.isArray(options) || options.length < 2) {
		throw new Error('showStatusSelection requires an array of at least 2 options.');
	}

	const result = await Swal.fire({
		title: "Mettre à jour le statut",
		text: "Choisissez un nouveau statut.",
		icon: "question",
		showCancelButton: true,
		showDenyButton: true,
		confirmButtonText: options[0],
		denyButtonText: options[1],
		cancelButtonText: "Annuler",
		reverseButtons: true,
	});

	if (result.isConfirmed) return options[0];
	if (result.isDenied) return options[1];
	return null;
}