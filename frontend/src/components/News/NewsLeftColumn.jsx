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
        <div className="left space-y-[40px] md:space-y-[30px] grow">
            {paginatedNews.length === 0 ? (
                <div className="py-[40px] text-[20px] text-etGray text-center">
                    <p className="inline-block bg-red-100 shadow px-6 py-4 rounded-md text-red-800">
                        Aucune news trouvée pour votre recherche.
                    </p>
                </div>
            ) : (
                paginatedNews.map((item) => {
                    const date = new Date(item.date_posted);
                    const day = date.getDate();
                    const month = date.toLocaleString('default', { month: 'short' });

                    return (
                        <div key={item.id} className="p-[24px] xxs:p-[18px] border border-[#D9D9D9] rounded-[8px]">
                            <div className="relative mb-[30px] rounded-[8px] overflow-hidden img">
                                <img src={`${item.image_url}`} alt="news-cover" className="mx-auto w-full max-h-[300px] object-cover" />
                                <div className="top-[20px] left-[20px] absolute bg-[#CE22BF] px-[20px] py-[13px] rounded-[6px] text-white">
                                    <span className="block mb-[6px] font-medium text-[24px] leading-[0.7]">{day}</span>
                                    <span className="block font-medium text-[12px] leading-[0.7]">{month}</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-[30px] mb-[5px]">
                                    <div className="flex items-center gap-[10px]">
                                        <a href={`/profile/${item.User?.id}`} className="flex items-center gap-[6px] hover:text-[#CE22BF] transition">
                                            <img
                                                src={`${item.User?.profile_image}`}
                                                alt="user"
                                                className="border border-gray-300 rounded-full w-[28px] h-[28px] object-cover"
                                            />
                                            <span className="text-[14px] text-etGray">Par {item.User.name} {item.User.lastname}</span>
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-[10px]">
                                        <span className="shrink-0"></span>
                                        <span className={`text-[12px] font-medium px-[10px] py-[4px] rounded-full inline-block ${getCategoryStyle(item.categories[0]?.name)}`}><a href="#">{item.categories[0]?.name || 'Uncategorized'}</a></span>
                                    </div>
                                </div>

                                <h3 className="mb-[10px] font-medium text-[30px] text-etBlack xxs:text-[22px] sm:text-[24px] lg:text-[27px]">
                                    <a href={`/news/${item.id}`} className="hover:text-[#CE22BF]">{item.title}</a>
                                </h3>

                                <p className="mb-[10px] font-light text-[16px] text-etGray">
                                    {item.content.length > 180 ? item.content.slice(0, 180) + '...' : item.content}
                                </p>

                                <a href={`/news/${item.id}`} className="text-[#CE22BF] text-[16px] hover:text-[#CE22BF]">
                                    Lire la suite <span className="pl-[5px]"><i className="fa-arrow-right-long fa-solid"></i></span>
                                </a>
                            </div>
                        </div>
                    );
                })
            )}
            {filteredNews.length > 0 && (

                <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full container">
                    <div className="flex justify-center items-center gap-[20px] pt-[60px] text-[16px]">

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="disabled:opacity-50"
                        >
                            <i className="fa-arrow-left-long fa-solid"></i>
                        </button>

                        <div className="flex items-center gap-[10px] et-pagination">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`border border-[#d9d9d9] rounded-full w-[50px] h-[50px] flex items-center justify-center 
                                                        ${currentPage === index + 1
                                            ? 'bg-[#CE22BF] text-white border-[#CE22BF]'
                                            : 'text-etBlack hover:bg-[#CE22BF] hover:border-[#CE22BF] hover:text-white'}`}
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
                            <i className="fa-arrow-right-long fa-solid"></i>
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsLeftColumn;