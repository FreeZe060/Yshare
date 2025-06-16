import React from 'react';

function NewsLeftColumn({
    paginatedNews,
    filteredNews,
    currentPage,
    setCurrentPage,
    totalPages,
    getCategoryStyle,
}) {
    return (
        <div className="left grow space-y-[40px] md:space-y-[30px]">
            {paginatedNews.length === 0 ? (
                <div className="text-center text-[20px] text-etGray py-[40px]">
                    <p className="bg-red-100 text-red-800 px-6 py-4 rounded-md inline-block shadow">
                        Aucune news trouvée pour votre recherche.
                    </p>
                </div>
            ) : (
                paginatedNews.map((item) => {
                    const date = new Date(item.date_posted);
                    const day = date.getDate();
                    const month = date.toLocaleString('default', { month: 'short' });

                    return (
                        <div key={item.id} className="border border-[#D9D9D9] rounded-[8px] p-[24px] xxs:p-[18px]">
                            <div className="img overflow-hidden rounded-[8px] mb-[30px] relative">
                                <img src={`http://localhost:8080${item.image_url}`} alt="news-cover" className="w-full max-h-[300px] mx-auto object-cover" />
                                <div className="bg-etBlue rounded-[6px] absolute top-[20px] left-[20px] text-white px-[20px] py-[13px]">
                                    <span className="block text-[24px] font-medium leading-[0.7] mb-[6px]">{day}</span>
                                    <span className="block text-[12px] font-medium leading-[0.7]">{month}</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-[30px] mb-[5px]">
                                    <div className="flex gap-[10px] items-center">
                                        <a href={`/profile/${item.User?.id}`} className="flex items-center gap-[6px] hover:text-etBlue transition">
                                            <img
                                                src={`http://localhost:8080${item.User?.profile_image}`}
                                                alt="user"
                                                className="w-[28px] h-[28px] rounded-full object-cover border border-gray-300"
                                            />
                                            <span className="text-[14px] text-etGray">Par {item.User.name} {item.User.lastname}</span>
                                        </a>
                                    </div>

                                    <div className="flex gap-[10px] items-center">
                                        <span className="shrink-0"></span>
                                        <span className={`text-[12px] font-medium px-[10px] py-[4px] rounded-full inline-block ${getCategoryStyle(item.categories[0]?.name)}`}><a href="#">{item.categories[0]?.name || 'Uncategorized'}</a></span>
                                    </div>
                                </div>

                                <h3 className="text-[30px] lg:text-[27px] sm:text-[24px] xxs:text-[22px] font-medium text-etBlack mb-[10px]">
                                    <a href={`/news/${item.id}`} className="hover:text-etBlue">{item.title}</a>
                                </h3>

                                <p className="font-light text-[16px] text-etGray mb-[10px]">
                                    {item.content.length > 180 ? item.content.slice(0, 180) + '...' : item.content}
                                </p>

                                <a href={`/news/${item.id}`} className="text-etBlue text-[16px] hover:text-etBlue">
                                    Lire la suite <span className="pl-[5px]"><i className="fa-solid fa-arrow-right-long"></i></span>
                                </a>
                            </div>
                        </div>
                    );
                })
            )}
            {filteredNews.length > 0 && (

                <div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full">
                    <div className="flex items-center gap-[20px] pt-[60px] justify-center text-[16px]">

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="disabled:opacity-50"
                        >
                            <i className="fa-solid fa-arrow-left-long"></i>
                        </button>

                        <div className="et-pagination flex gap-[10px] items-center">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`border border-[#d9d9d9] rounded-full w-[50px] h-[50px] flex items-center justify-center 
                                                        ${currentPage === index + 1
                                            ? 'bg-etBlue text-white border-etBlue'
                                            : 'text-etBlack hover:bg-etBlue hover:border-etBlue hover:text-white'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="disabled:opacity-50"
                        >
                            <i className="fa-solid fa-arrow-right-long"></i>
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsLeftColumn;