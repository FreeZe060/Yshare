import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import Swal from 'sweetalert2';
import useReplyComment from '../../hooks/Comments/useReplyComment';
import { useAddReaction } from '../../hooks/Comments/useAddReaction';
import { useRemoveReaction } from '../../hooks/Comments/useRemoveReaction';
import useReplies from '../../hooks/Comments/useReplies';
import { useReactions } from '../../hooks/Comments/useReactions';
import { useAuth } from '../../config/authHeader';
import ReportDropdown from '../Report/ReportDropdown';
import EditDeleteDropdown from './EditDeleteDropdown';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

function CommentBlock({ comment, eventId, depth = 0 }) {
	const [replyText, setReplyText] = useState('');
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [editedMessage, setEditedMessage] = useState(comment.message);

	const { replies, fetchReplies, loading: loadingReplies } = useReplies(comment.id);
	const { reply } = useReplyComment();

	const { user } = useAuth();
	const token = user?.token;

	const isAuthor = user?.id === comment.author?.id;
	const isAdmin = user?.role === 'Administrateur';
	const canReport = user && !isAuthor;

	const { reactions, refetchReactions } = useReactions(comment.id, token);
	const { addReaction } = useAddReaction();
	const { removeReaction } = useRemoveReaction(token);
	const [isDeleted, setIsDeleted] = useState(false);
	if (isDeleted) return null;

	const emojiCounts = reactions.reduce((acc, r) => {
		acc[r.emoji] = (acc[r.emoji] || 0) + 1;
		return acc;
	}, {});
	const displayedEmojis = Object.keys(emojiCounts);

	const handleReply = async () => {
		if (!user) {
			Swal.fire('Vous devez être connecté pour écrire un commentaire.');
			return;
		}
		if (!replyText.trim()) return;
		await reply(eventId, comment.id, { title: 'Réponse', message: replyText });
		setReplyText('');
		setShowReplyInput(false);

		await fetchReplies();

		setShowReplies(true);
	};

	const handleReact = async (emoji) => {
		if (!user) {
			return Swal.fire('Vous devez être connecté pour interagir avec les commentaires.');
		}

		const userReactions = reactions.filter(r => r.User.id === user.id);
		const hasReactedToThisEmoji = userReactions.some(r => r.emoji === emoji);

		if (hasReactedToThisEmoji) {
			const confirm = await Swal.fire({
				title: 'Supprimer votre réaction ?',
				text: `Souhaitez-vous vraiment retirer votre réaction "${emoji}" ?`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#C320C0',
				cancelButtonColor: '#ccc',
				confirmButtonText: 'Oui, supprimer',
				cancelButtonText: 'Annuler'
			});
			if (confirm.isConfirmed) {
				await removeReaction(comment.id, emoji);
				await refetchReactions();
			}
		} else {
			if (userReactions.length >= 3) {
				return Swal.fire({
					icon: 'error',
					title: 'Limite atteinte',
					text: 'Vous ne pouvez pas réagir avec plus de 3 emojis à ce commentaire.'
				});
			}
			await addReaction(comment.id, emoji);
			await refetchReactions();
		}
	};

	const onEmojiClick = async (emojiData) => {
		const emoji = emojiData.emoji || emojiData.native || emojiData.unified;
		if (!emoji) {
			console.error('❌ Impossible de récupérer l’emoji sélectionné :', emojiData);
			return;
		}
		await handleReact(emoji);
		setShowEmojiPicker(false);
	};

	return (
		<div className="flex gap-4">
			<Link to={`/profile/${comment.author?.id}`}>
				<img
					src={
						comment.author?.profileImage
							? `${API_BASE_URL}${comment.author.profileImage}`
							: 'https://assets.codepen.io/285131/hat-man.png'
					}
					className="rounded-full w-10 h-10 object-cover"
					alt="avatar"
				/>
			</Link>
			<div className="flex-1 space-y-2">
				<div className="text-gray-500 text-sm">
					<Link
						to={`/profile/${comment.author?.id}`}
					>
						<span className="font-medium text-gray-800">
							{comment.author ? `${comment.author.name} ${comment.author.lastname}` : 'Utilisateur'}
						</span>
					</Link>
					– {new Date(comment.date_posted).toLocaleDateString()}
				</div>
				<div className="bg-gray-50 shadow-sm p-4 border border-gray-200 rounded-md relative">
					{user && (
						<div className="absolute top-2 right-2">
							{user && (
								<div className="absolute top-2 right-2">
									{(isAdmin || isAuthor) ? (
										<EditDeleteDropdown
											comment={comment}
											onEditSuccess={(newMsg) => setEditedMessage(newMsg)}
											onDeleteSuccess={() => setIsDeleted(true)}
										/>
									) : canReport && (
										<ReportDropdown
											contextType="comment"
											commentId={comment.id}
											eventId={eventId}
											organizerId={comment.author?.id}
										/>
									)}
								</div>
							)}
						</div>
					)}
					<p className="text-gray-700">{editedMessage}</p>
					<div className="flex items-center gap-2 mt-3">
						{displayedEmojis.map((emoji) => (
							<button
								key={emoji}
								onClick={() => handleReact(emoji)}
								className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
							>
								{emoji} {emojiCounts[emoji]}
							</button>
						))}
						<button
							onClick={() => {
								if (!user) {
									return Swal.fire('Vous devez être connecté pour interagir avec les commentaires.');
								}
								setShowEmojiPicker(prev => !prev);
							}}
							className="flex justify-center items-center hover:bg-gray-200 rounded-full w-8 h-8 text-gray-400"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 12a5 5 0 0 0 10 0h-2a3 3 0 0 1-6 0H7z" />
							</svg>
						</button>
						<button
							onClick={() => {
								if (!user) {
									return Swal.fire('Vous devez être connecté pour répondre à un commentaire.');
								}
								setShowReplyInput(prev => !prev);
							}}
							className="ml-auto text-[#D232BE] hover:underline"
						>
							↪ Répondre
						</button>
					</div>
					{showEmojiPicker && (
						<div className="mt-2">
							<Picker onEmojiClick={onEmojiClick} />
						</div>
					)}
				</div>

				{(comment.replyCount > 0 || comment.replies?.length > 0 || showReplies) && (
					<div className={`mt-4 ${depth >= 2 ? '' : 'border-l pl-4'} space-y-2`}>
						<button
							onClick={async () => {
								if (!showReplies) await fetchReplies();
								setShowReplies(!showReplies);
							}}
							className="flex items-center text-gray-500 text-sm hover:underline"
						>
							<svg className="mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11l4 4-4 4M19 15H8a4 4 0 010-8h1" />
							</svg>
							{showReplies
								? 'Masquer les réponses'
								: `Afficher ${comment.replyCount || comment.replies?.length || 0} réponse(s)`}
						</button>

						{showReplies && (
							<div className="space-y-4 mt-2">
								{loadingReplies ? (
									<p className="text-gray-400 text-sm italic">Chargement…</p>
								) : (
									replies.map((reply) => (
										<CommentBlock
											key={reply.id}
											comment={reply}
											eventId={eventId}
											depth={depth + 1}
										/>
									))
								)}
							</div>
						)}
					</div>
				)}

				{showReplyInput && (
					<div className="pt-2">
						<div className="flex justify-between items-center mb-1">
							<span className="text-gray-500 text-sm">Répondre à ce commentaire</span>
							<button
								onClick={() => setShowReplyInput(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>
						<input
							type="text"
							value={replyText}
							onChange={(e) => setReplyText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleReply()}
							placeholder="Répondre..."
							className="px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100 w-full h-10"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default CommentBlock;