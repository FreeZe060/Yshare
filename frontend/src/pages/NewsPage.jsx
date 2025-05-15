import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from '../components/Footer';
import useAllNews from '../hooks/News/useAllNews';
import useCategories from "../hooks/Categorie/useCategories";


function NewsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [selectedCategory, setSelectedCategory] = useState(null);
    const { categories } = useCategories();

    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const { news, loading: loadingNews, error: errorNews } = useAllNews();

    const filteredNews = news.filter((item) => {
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchCategory = selectedCategory
            ? item.categories.some(cat => cat.name === selectedCategory)
            : true;

        return matchSearch && matchCategory;
    });


    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

    const latestNews = [...news]
        .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted))
        .slice(0, 3);

    const getCategoryStyle = (categoryName) => {
        switch (categoryName?.toLowerCase()) {
            case 'Sport':
                return 'bg-blue-100 text-blue-800';
            case 'Musique':
                return 'bg-green-100 text-green-800';
            case 'Fête':
                return 'bg-yellow-100 text-yellow-800';
            case 'Foot':
                return 'bg-purple-100 text-purple-800';
            case 'art & design':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getNewsCountByCategory = (categoryName) => {
        return news.filter(n =>
            n.categories.some(cat => cat.name === categoryName)
        ).length;
    };

    if (loadingNews) return <p>Loading...</p>;
    if (errorNews) return <p>Error: {errorNews}</p>;

    return (
        <>
            <Header />
            <main>
                <section className="et-breadcrumb bg-[#000D83] pt-[210px] lg:pt-[190px] sm:pt-[160px] pb-[130px] lg:pb-[110px] sm:pb-[80px] relative z-[1] before:absolute before:inset-0 before:bg-no-repeat before:bg-cover before:bg-center before:-z-[1] before:opacity-30">
                    <div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full text-center text-white">
                        <h1 className="et-breadcrumb-title font-medium text-[56px] md:text-[50px] xs:text-[45px]">All News</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-etBlue">Home</a></li>
                            <li><i className="fa-solid fa-angle-right"></i><i className="fa-solid fa-angle-right"></i></li>
                            <li className="current-page">All News</li>
                        </ul>
                    </div>
                </section>

                <div className="et-event-details-content py-[130px] lg:py-[80px] md:py-[60px]">
                    <div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full">
                        <div className="flex gap-[30px] lg:gap-[20px] md:flex-col md:items-center">
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
                                                            <span className="shrink-0">{/* Icone auteur ici */}</span>
                                                            <span className="text-[14px] text-etGray">by <a href="#">{item.User.name} {item.User.lastname}</a></span>
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
                                                        Read More <span className="pl-[5px]"><i className="fa-solid fa-arrow-right-long"></i></span>
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

                            <div className="right max-w-full w-[370px] lg:w-[360px] shrink-0 space-y-[30px] md:space-y-[25px]">
                                <div className="border border-[#e5e5e5] rounded-[10px] px-[30px] xxs:px-[20px] pt-[30px] xxs:pt-[20px] pb-[40px] xxs:pb-[30px]">
                                    <h4 className="font-medium text-[24px] xxs:text-[20px] text-etBlack relative mb-[5px] before:content-normal before:absolute before:left-0 before:-bottom-[5px] before:w-[50px] before:h-[2px] before:bg-etBlue">Search</h4>

                                    <form
                                        onSubmit={(e) => e.preventDefault()}
                                        className="border border-[#e5e5e5] rounded-[8px] flex h-[60px] px-[20px] mt-[30px]"
                                    >
                                        <input
                                            type="search"
                                            name="search"
                                            id="et-news-search"
                                            className="w-full bg-transparent text-[16px] focus:outline-none"
                                            placeholder="Search here.."
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
                                    <h4 className="font-medium text-[24px] xxs:text-[20px] text-etBlack relative mb-[5px] before:content-normal before:absolute before:left-0 before:-bottom-[5px] before:w-[50px] before:h-[2px] before:bg-etBlue">Recent Post</h4>

                                    <div className="posts mt-[30px] space-y-[24px]">
                                        {latestNews.map((post) => {
                                            const postDate = new Date(post.date_posted);
                                            const formattedDate = postDate.toLocaleDateString("en-US", {
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
                        </div>
                    </div>
                </div>
            </main>
            < Footer />
        </>
    )
}

export default NewsPage