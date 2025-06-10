import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';
import useNewsDetails from '../hooks/News/useNewsDetails';
import useAllNews from '../hooks/News/useAllNews';
import useUpdateNews from '../hooks/News/useUpdateNews';
import Swal from 'sweetalert2';
import useCategories from '../hooks/Categorie/useCategories';
import { addCategoryToNews, removeCategoryFromNews } from '../services/newsService';
import { useAuth } from '../config/authHeader';
import NewsDetailsLeft from '../components/News_Details/NewsDetailsLeft';
import NewsDetailsRight from '../components/News_Details/NewsDetailsRight';


function NewsDetails() {

    const { newsId } = useParams();
    const { newsDetails, loading, error } = useNewsDetails(newsId);
    const { news, loading: loadingNews, error: errorNews } = useAllNews();
    const { isOwner, isAdmin, update } = useUpdateNews(newsId);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const { categories: allCategories } = useCategories();
    const [showAddCat, setShowAddCat] = useState(false);

    const latestNews = [...news]
        .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted))
        .slice(0, 3);

    const getCategoryStyle = (categoryName) => {
        const name = categoryName?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        switch (name) {
            case 'sport':
                return 'bg-blue-100 text-blue-800';
            case 'musique':
                return 'bg-green-100 text-green-800';
            case 'fete':
                return 'bg-yellow-100 text-yellow-800';
            case 'foot':
                return 'bg-purple-100 text-purple-800';
            case 'art & design':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const linkedCategoryIds = newsDetails?.categories?.map(cat => cat.id) || [];
    const availableCategories = allCategories.filter(cat => !linkedCategoryIds.includes(cat.id));

    const editorRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (editorRef.current && !editorRef.current.contains(e.target) && isEditing) {
                if (
                    editedTitle !== newsDetails.title ||
                    editedContent !== newsDetails.content
                ) {
                    handleSave(); // auto-save
                } else {
                    setIsEditing(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditing, editedTitle, editedContent]);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("title", editedTitle);
        formData.append("content", editedContent);

        try {
            const updated = await update(formData);
            Object.assign(newsDetails, updated);
            setIsEditing(false);
        } catch (err) {
            Swal.fire("Erreur", err.message, "error");
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p className="text-red-600">Erreur: {error}</p>;
    if (!newsDetails) return <p>Aucune actualité trouvée.</p>;

    const date = new Date(newsDetails.date_posted);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });

    return (
        <>
            <Header />
            <main>
                <section className="et-breadcrumb bg-[#000D83] pt-[210px] lg:pt-[190px] sm:pt-[160px] pb-[130px] lg:pb-[110px] sm:pb-[80px] relative z-[1] before:absolute before:inset-0 before:bg-no-repeat before:bg-cover before:bg-center before:-z-[1] before:opacity-30">
                    <div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full text-center text-white">
                        <h1 className="et-breadcrumb-title font-medium text-[56px] md:text-[50px] xs:text-[45px]">Details de l'actualités</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-etBlue">Accueil</a></li>
                            <li><i className="fa-solid fa-angle-right"></i><i className="fa-solid fa-angle-right"></i></li>
                            <li className="current-page"><a href="/news" className="hover:text-etBlue">Page Des Actualités</a></li>
                            <li><i className="fa-solid fa-angle-right"></i><i className="fa-solid fa-angle-right"></i></li>
                            <li className="current-page">Details de l'actualités</li>
                        </ul>
                    </div>
                </section>

                <div class="et-event-details-content py-[130px] lg:py-[80px] md:py-[60px]">
                    <div class="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full">
                        <div class="flex gap-[30px] lg:gap-[20px] md:flex-col md:items-center">
                            
                            <NewsDetailsLeft 
                                newsDetails={newsDetails}
                                isOwner={isOwner}
                                isAdmin={isAdmin}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                editedTitle={editedTitle}
                                setEditedTitle={setEditedTitle}
                                editedContent={editedContent}
                                setEditedContent={setEditedContent}
                                handleSave={handleSave}
                                editorRef={editorRef}
                                availableCategories={availableCategories}
                                showAddCat={showAddCat}
                                setShowAddCat={setShowAddCat}
                                getCategoryStyle={getCategoryStyle}
                                day={day}
                                month={month}
                                newsId={newsId}
                                removeCategoryFromNews={removeCategoryFromNews}
                                addCategoryToNews={addCategoryToNews}
                                useAuth={useAuth}
                            />

                            <NewsDetailsRight 
                                latestNews={latestNews}
                            />
                        </div>
                    </div>
                </div>
            </main >
            < Footer />
        </>
    )
}

export default NewsDetails