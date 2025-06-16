import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';
import useAllNews from '../hooks/News/useAllNews';
import useCategories from "../hooks/Categorie/useCategories";
import NewsLeftColumn from '../components/News/NewsLeftColumn';
import NewsRightColumn from '../components/News/NewsRightColumn';

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
                        <h1 className="et-breadcrumb-title font-medium text-[56px] md:text-[50px] xs:text-[45px]">Toutes les actualités</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-etBlue">Accueil</a></li>
                            <li><i className="fa-solid fa-angle-right"></i><i className="fa-solid fa-angle-right"></i></li>
                            <li className="current-page">Toutes les actualités</li>
                        </ul>
                    </div>
                </section>

                <div className="et-event-details-content py-[130px] lg:py-[80px] md:py-[60px]">
                    <div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full">
                        <div className="flex gap-[30px] lg:gap-[20px] md:flex-col md:items-center">

                            <NewsLeftColumn
                                paginatedNews={paginatedNews}
                                filteredNews={filteredNews}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                getCategoryStyle={getCategoryStyle}
                            />
                            <NewsRightColumn
                                latestNews={latestNews}
                                categories={categories}
                                getNewsCountByCategory={getNewsCountByCategory}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </main>
            < Footer />
        </>
    )
}

export default NewsPage