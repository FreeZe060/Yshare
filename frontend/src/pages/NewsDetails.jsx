import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';
import useNewsDetails from '../hooks/News/useNewsDetails';
import useAllNews from '../hooks/News/useAllNews';
import useUpdateNews from '../hooks/News/useUpdateNews';
import Swal from 'sweetalert2';
import useCategories from '../hooks/Categorie/useCategories';
import vector1 from '../assets/img/et-3-event-vector.svg';
import { addCategoryToNews, removeCategoryFromNews } from '../services/newsService';
import { useAuth } from '../config/authHeader';
import NewsDetailsLeft from '../components/News_Details/NewsDetailsLeft';
import NewsDetailsRight from '../components/News_Details/NewsDetailsRight';
import useLinkEventToNews from '../hooks/News/useLinkEventToNews';

function NewsDetails() {
    const { newsId } = useParams();
    const { newsDetails, loading, error, setNewsDetails, refetchNewsDetails } = useNewsDetails(newsId);
    const { news } = useAllNews();
    const { isOwner, isAdmin, update } = useUpdateNews(newsId);
    const { categories: allCategories } = useCategories();
    const { link, loading: linking, error: linkError } = useLinkEventToNews();

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [showAddCat, setShowAddCat] = useState(false);
    const editorRef = useRef(null);

    const latestNews = [...news]
        .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted))
        .slice(0, 3);

    const getCategoryStyle = (name) => {
        const clean = name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return {
            sport: 'bg-blue-100 text-blue-800',
            musique: 'bg-green-100 text-green-800',
            fete: 'bg-yellow-100 text-yellow-800',
            foot: 'bg-purple-100 text-purple-800',
            'art & design': 'bg-pink-100 text-pink-800',
        }[clean] || 'bg-gray-100 text-gray-800';
    };

    const linkedCategoryIds = newsDetails?.categories?.map(cat => cat.id) || [];
    const availableCategories = allCategories.filter(cat => !linkedCategoryIds.includes(cat.id));

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (editorRef.current && !editorRef.current.contains(e.target)) {
                if (isEditing) {
                    if (
                        editedTitle !== newsDetails?.title ||
                        editedContent !== newsDetails?.content
                    ) {
                        handleSave();
                    } else {
                        setIsEditing(false);
                    }
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditing, editedTitle, editedContent, newsDetails]);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("title", editedTitle);
        formData.append("content", editedContent);
        try {
            await update(formData);
            await refetchNewsDetails();
            setIsEditing(false);
        } catch (err) {
            Swal.fire("Erreur", err.message, "error");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            await update(formData);
            await refetchNewsDetails();
            Swal.fire("Succès", "Image mise à jour", "success");
        } catch (err) {
            Swal.fire("Erreur", err.message || "Erreur lors de l'upload", "error");
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
                <section style={{
                    backgroundImage: `linear-gradient(to top right, #580FCA, #F929BB), url(${vector1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'overlay',
                }}
                    className="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title">Details de l'actualités</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-[#CE22BF]">Accueil</a></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page"><a href="/news" className="hover:text-[#CE22BF]">Page Des Actualités</a></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page">Details de l'actualités</li>
                        </ul>
                    </div>
                </section>

                <div className="py-[130px] md:py-[60px] lg:py-[80px] et-event-details-content">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full container">
                        <div className="flex md:flex-col md:items-center gap-[30px] lg:gap-[20px]">

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
                                handleImageUpload={handleImageUpload}
                                link={link}
                                linking={linking}
                                linkError={linkError}
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