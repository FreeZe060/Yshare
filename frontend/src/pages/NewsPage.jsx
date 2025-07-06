import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';
import useAllNews from '../hooks/News/useAllNews';
import useCategories from "../hooks/Categorie/useCategories";
import NewsLeftColumn from '../components/News/NewsLeftColumn';
import NewsRightColumn from '../components/News/NewsRightColumn';
import vector1 from '../assets/img/et-3-event-vector.svg';

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

    // if (loadingNews) return <p>Loading...</p>;
    if (errorNews) return <p>Error: {errorNews}</p>;

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
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title">Toutes les actualités</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-[#CE22BF]">Accueil</a></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page">Toutes les actualités</li>
                        </ul>
                    </div>
                </section>

                {!loadingNews && <div className="py-[130px] md:py-[60px] lg:py-[80px] et-event-details-content">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full container">
                        <div className="flex md:flex-col md:items-center gap-[30px] lg:gap-[20px]">

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
                </div>}

            </main>
            < Footer />
        </>
    )
}

export default NewsPage