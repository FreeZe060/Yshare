import React from 'react';
import useSortedAndPaginatedData from '../../../hooks/Utils/useSortedAndPaginatedData';
import NotFound from '../../../pages/NotFound';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/';

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
    if (error) return <NotFound />;

    return (
        <div className="left space-y-[30px] md:space-y-[20px] grow">
            <h1 className="py-3 font-semibold text-gray-800 text-xl uppercase">Toutes les News</h1>

            <div className="flex justify-end mb-4">
                <Link
                    to="/create-news"
                    className="bg-[#C72EBF] hover:bg-[#BA28C0] shadow px-4 py-2 rounded text-white transition"
                >
                    <i className="mr-2 fas fa-plus" />
                    Ajouter une News
                </Link>
            </div>

            {paginatedNews.map((item) => {
                const { day, month } = getDayMonth(item.date_posted);
                const imageUrl = item.image_url?.startsWith('http')
                    ? item.image_url
                    : `${REACT_APP_API_BASE_URL}${item.image_url}`;

                return (
                    <div
                        key={item.id}
                        className="relative p-[16px] xxs:p-[12px] border border-[#D9D9D9] rounded-[6px] text-sm"
                    >
                        <div className="relative mb-[20px] rounded-[6px] overflow-hidden img">
                            <img src={imageUrl} alt="news-cover" className="w-full max-h-[200px] object-cover" />
                            <div className="top-[12px] left-[12px] absolute bg-[#CE22BF] px-[12px] py-[6px] rounded-[4px] text-white text-center">
                                <span className="block mb-[3px] font-medium text-[18px] leading-[0.7]">{day}</span>
                                <span className="block font-medium text-[10px] leading-[0.7]">{month}</span>
                            </div>
                        </div>

                        <div className="mb-[30px]">
                            <div className="flex items-center gap-[20px] mb-[5px] text-xs">
                                <div className="flex items-center gap-[6px]">
                                    <span><i className="text-[#CE22BF] fas fa-user" /></span>
                                    <Link
                                        to={`/profile/${item.User?.id}`}
                                        className="text-etGray hover:underline"
                                    >
                                        {item.User?.name || 'Utilisateur inconnu'}
                                    </Link>
                                </div>

                                <div className="flex items-center gap-[6px]">
                                    <span><i className="text-[#CE22BF] fas fa-folder" /></span>
                                    <span className="text-etGray">
                                        {item.categories?.[0]?.name || 'Sans catégorie'}
                                    </span>
                                </div>
                            </div>

                            <h3 className="mb-[8px] font-semibold text-[20px] text-etBlack">
                                {item.title}
                            </h3>
                            <p className="mb-[8px] text-[14px] text-etGray leading-snug">
                                {item.content.length > 150 ? item.content.slice(0, 150) + '...' : item.content}
                            </p>
                            <a
                                href={`/news/${item.id}`}
                                className="text-[#CE22BF] text-[14px] hover:underline"
                            >
                                Lire la suite <i className="fa-arrow-right-long ml-1 fa-solid"></i>
                            </a>
                        </div>

                        <div className="right-[12px] bottom-[12px] absolute">
                            <Link
                                to={`/news/edit/${item.id}`}
                                className="bg-[#CE22BF] hover:bg-etPink shadow px-3 py-1 rounded-full text-white text-xs hover:scale-105 transition-all duration-300"
                            >
                                <i className="mr-1 fas fa-pen"></i> Modifier
                            </Link>
                        </div>

                        <button
                            onClick={() => { onDelete(item); refetch(); }}
                            className="bg-red-600 hover:bg-red-700 shadow ml-2 px-3 py-1 rounded-full text-white text-xs hover:scale-105 transition-all duration-300"
                        >
                            <i className="mr-1 fas fa-trash-alt"></i> Supprimer
                        </button>
                    </div>
                );
            })}

            <div className="flex justify-center gap-3 mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`w-8 h-8 text-xs rounded-full border transition-all duration-300 ${page === i + 1
                            ? 'bg-[#CE22BF] text-white scale-110 shadow-md'
                            : 'border-[#CE22BF] text-[#CE22BF] hover:bg-[#CE22BF] hover:text-white hover:scale-105'
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
