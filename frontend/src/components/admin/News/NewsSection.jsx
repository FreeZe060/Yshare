import React from 'react';
import useSortedAndPaginatedData from '../../../hooks/Utils/useSortedAndPaginatedData';

const ITEMS_PER_PAGE = 2;

const NewsSection = ({ news, loading, error, onDelete, Link, refetch }) => {

    const {
        paginatedItems: paginatedNews,
        pagination: { page, totalPages, goToPage },
    } = useSortedAndPaginatedData(news, null, ITEMS_PER_PAGE);

    const getDayMonth = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('fr-FR', { month: 'short' });
        return { day, month };
    };

    // if (loading) return <p>Chargement des actualités...</p>;
    if (error) return <p className="text-red-500">Erreur : {error}</p>;

    return (
        <div className="left grow space-y-[30px] md:space-y-[20px]">
            <h1 className="text-xl font-semibold py-3 uppercase text-gray-800">Toutes les News</h1>

            <div className="flex justify-end mb-4">
                <Link
                    to="/create-news"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
                >
                    <i className="fas fa-plus mr-2" />
                    Ajouter une News
                </Link>
            </div>

            {paginatedNews.map((item) => {
                const { day, month } = getDayMonth(item.date_posted);
                const imageUrl = item.image_url?.startsWith('http')
                    ? item.image_url
                    : `http://localhost:8080${item.image_url}`;

                return (
                    <div
                        key={item.id}
                        className="relative border border-[#D9D9D9] rounded-[6px] p-[16px] xxs:p-[12px] text-sm"
                    >
                        <div className="img overflow-hidden rounded-[6px] mb-[20px] relative">
                            <img src={imageUrl} alt="news-cover" className="w-full max-h-[200px] object-cover" />
                            <div className="bg-etBlue rounded-[4px] absolute top-[12px] left-[12px] text-white px-[12px] py-[6px] text-center">
                                <span className="block text-[18px] font-medium leading-[0.7] mb-[3px]">{day}</span>
                                <span className="block text-[10px] font-medium leading-[0.7]">{month}</span>
                            </div>
                        </div>

                        <div className="mb-[30px]">
                            <div className="flex items-center gap-[20px] mb-[5px] text-xs">
                                <div className="flex gap-[6px] items-center">
                                    <span><i className="fas fa-user text-etBlue" /></span>
                                    <Link
                                        to={`/profile/${item.User?.id}`}
                                        className="text-etGray hover:underline"
                                    >
                                        {item.User?.name || 'Utilisateur inconnu'}
                                    </Link>
                                </div>

                                <div className="flex gap-[6px] items-center">
                                    <span><i className="fas fa-folder text-etBlue" /></span>
                                    <span className="text-etGray">
                                        {item.categories?.[0]?.name || 'Sans catégorie'}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-[20px] font-semibold text-etBlack mb-[8px]">
                                {item.title}
                            </h3>
                            <p className="text-[14px] text-etGray mb-[8px] leading-snug">
                                {item.content.length > 150 ? item.content.slice(0, 150) + '...' : item.content}
                            </p>
                            <a
                                href={`/news/${item.id}`}
                                className="text-etBlue text-[14px] hover:underline"
                            >
                                Lire la suite <i className="fa-solid fa-arrow-right-long ml-1"></i>
                            </a>
                        </div>

                        <div className="absolute bottom-[12px] right-[12px]">
                            <Link
                                to={`/news/edit/${item.id}`}
                                className="bg-etBlue hover:bg-etPink text-white px-3 py-1 text-xs rounded-full shadow transition-all duration-300 hover:scale-105"
                            >
                                <i className="fas fa-pen mr-1"></i> Modifier
                            </Link>
                        </div>

                        <button
                            onClick={() => { onDelete(item); refetch(); }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded-full shadow transition-all duration-300 hover:scale-105 ml-2"
                        >
                            <i className="fas fa-trash-alt mr-1"></i> Supprimer
                        </button>
                    </div>
                );
            })}

            <div className="flex justify-center mt-6 gap-3">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`w-8 h-8 text-xs rounded-full border transition-all duration-300 ${page === i + 1
                            ? 'bg-etBlue text-white scale-110 shadow-md'
                            : 'border-etBlue text-etBlue hover:bg-etBlue hover:text-white hover:scale-105'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NewsSection;
