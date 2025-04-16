import Swal from 'sweetalert2';

export function showConfirmation({ title, text, icon, confirmText }) {
	return Swal.fire({
		title,
		text,
		icon,
		showCancelButton: true,
		confirmButtonText: confirmText,
		cancelButtonText: 'Annuler',
	});
}