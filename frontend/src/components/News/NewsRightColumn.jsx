import React from 'react';
import { motion } from "framer-motion";

function NewsRightColumn({
    categories,
    latestNews,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    setCurrentPage,
    getNewsCountByCategory
}) {

    return (
        <div className="right max-w-full w-[370px] lg:w-[360px] shrink-0 space-y-[30px] md:space-y-[25px]">
            <div className="border border-[#e5e5e5] rounded-[10px] px-[30px] xxs:px-[20px] pt-[30px] xxs:pt-[20px] pb-[40px] xxs:pb-[30px]">
                <h4 className="font-medium text-[24px] xxs:text-[20px] text-etBlack relative mb-[5px] before:content-normal before:absolute before:left-0 before:-bottom-[5px] before:w-[50px] before:h-[2px] before:bg-etBlue">Recherche</h4>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="border border-[#e5e5e5] rounded-[8px] flex h-[60px] px-[20px] mt-[30px]"
                >
                    <input
                        type="search"
                        name="search"
                        id="et-news-search"
                        className="w-full bg-transparent text-[16px] focus:outline-none"
                        placeholder="Rechercher ici.."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <button type="submit" className="text-[16px] hover:text-etBlue">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>
            </div>

            <div className="border border-[#e5e5e5] rounded-[10px] px-[30px] xxs:px-[20px] pt-[30px] xxs:pt-[20px] pb-[40px] xxs:pb-[30px]">
                <h4 className="font-medium text-[24px] xxs:text-[20px] text-etBlack relative mb-[5px] before:content-normal before:absolute before:left-0 before:-bottom-[5px] before:w-[50px] before:h-[2px] before:bg-etBlue">Categories</h4>
                <ul className="mt-[30px] text-[16px]">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.name;
                        const count = getNewsCountByCategory(cat.name);

                        return (
                            <motion.li
                                key={cat.id}
                                className={`py-[16px] border-b border-t border-[#D9D9D9] transition-colors duration-300 ${isSelected ? 'bg-blue-50 text-etBlue font-semibold shadow-inner' : 'text-etBlack'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                            >
                                <a
                                    href="#"
                                    className="flex items-center justify-between hover:text-etBlue"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCategory(isSelected ? null : cat.name);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <span>{cat.name}</span>
                                    <span>({count})</span>
                                </a>
                            </motion.li>
                        );
                    })}
                </ul>
            </div>

            <div className="border border-[#e5e5e5] rounded-[10px] px-[30px] xxs:px-[20px] pt-[30px] xxs:pt-[20px] pb-[40px] xxs:pb-[30px]">
                <h4 className="font-medium text-[24px] xxs:text-[20px] text-etBlack relative mb-[5px] before:content-normal before:absolute before:left-0 before:-bottom-[5px] before:w-[50px] before:h-[2px] before:bg-etBlue"> Actualités récents</h4>

                <div className="posts mt-[30px] space-y-[24px]">
                    {latestNews.map((post) => {
                        const postDate = new Date(post.date_posted);
                        const formattedDate = postDate.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        });

                        return (
                            <div key={post.id} className="flex items-center gap-[16px]">
                                <div className="rounded-[6px] w-[78px] h-[79px] overflow-hidden shrink-0">
                                    <img
                                        src={`http://localhost:8080${post.image_url}`}
                                        alt="Post Image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div>
                                    <span className="date text-[14px] text-etGray flex items-center gap-[12px] mb-[3px]">
                                        <span className="icon">
                                            <i className="fa-solid fa-calendar-days text-etBlue"></i>
                                        </span>
                                        <span>{formattedDate}</span>
                                    </span>

                                    <h6 className="font-medium text-[15px] text-etBlack">
                                        <a href={`/news/${post.id}`} className="hover:text-etBlue">
                                            {post.title.length > 55 ? post.title.slice(0, 55) + "..." : post.title}
                                        </a>
                                    </h6>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
export default NewsRightColumn;