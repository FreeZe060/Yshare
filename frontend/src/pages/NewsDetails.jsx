import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/Header";
import Footer from '../components/Footer';
import useNewsDetails from '../hooks/News/useNewsDetails';
import useAllNews from '../hooks/News/useAllNews';


function NewsDetails() {

    const { newsId } = useParams();
    const { newsDetails, loading, error } = useNewsDetails(newsId);
    const { news, loading: loadingNews, error: errorNews } = useAllNews();

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
                        <h1 className="et-breadcrumb-title font-medium text-[56px] md:text-[50px] xs:text-[45px]">News Details</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-etBlue">Home</a></li>
                            <li><i className="fa-solid fa-angle-right"></i><i className="fa-solid fa-angle-right"></i></li>
                            <li className="current-page">News Details</li>
                        </ul>
                    </div>
                </section>

                <div class="et-event-details-content py-[130px] lg:py-[80px] md:py-[60px]">
                    <div class="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full">
                        <div class="flex gap-[30px] lg:gap-[20px] md:flex-col md:items-center">
                            <div class="left grow space-y-[40px] md:space-y-[30px]">
                                <div>
                                    <div className="img overflow-hidden rounded-[8px] mb-[30px] relative">
                                        <img src={`http://localhost:8080${newsDetails.image_url}`} alt="news-cover" className="w-full max-h-[400px] mx-auto object-cover" />
                                        <div className="bg-etBlue rounded-[6px] absolute top-[20px] left-[20px] text-white px-[20px] py-[13px]">
                                            <span className="block text-[24px] font-medium leading-[0.7] mb-[6px]">{day}</span>
                                            <span className="block text-[12px] font-medium leading-[0.7]">{month}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-[30px] mb-[7px]">
                                            <div className="flex gap-[10px] items-center text-etGray text-[14px]">
                                                <span>créateur</span>
                                                <a href={`/profile/${newsDetails.User?.id}`} className="flex items-center gap-[6px] hover:text-etBlue transition">
                                                    <img
                                                        src={`http://localhost:8080${newsDetails.User?.profile_image}`}
                                                        alt="user"
                                                        className="w-[28px] h-[28px] rounded-full object-cover border border-gray-300"
                                                    />
                                                    {newsDetails.User?.name} {newsDetails.User?.lastname}
                                                </a>
                                            </div>

                                            {newsDetails.categories.map((cat, idx) => (
                                                <div key={idx} className="flex gap-[10px] items-center text-etGray text-[14px]">
                                                    <span><a href="#">{cat.name}</a></span>
                                                </div>
                                            ))}
                                        </div>

                                        <h3 className="text-[30px] font-medium text-etBlack mb-[21px]">{newsDetails.title}</h3>

                                        <p className="font-light text-[16px] text-etGray mb-[16px]">{newsDetails.content}</p>
                                    </div>
                                </div>

                                <div className="border-y border-[#d9d9d9] py-[24px] flex items-center justify-between xs:flex-col xs:items-start gap-[20px]">
                                    <div className="flex gap-[28px] items-center">
                                        <h6 className="font-medium text-[16px] text-etBlack">Catégories:</h6>
                                        <div className="flex flex-wrap gap-[13px]">
                                            {newsDetails.categories.map((cat, idx) => (
                                                <a key={idx} href="#" className="border border-[#e5e5e5] text-[14px] text-[#181818] px-[12px] py-[5px] rounded-[4px] hover:bg-etBlue hover:border-etBlue hover:text-white">
                                                    {cat.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-[28px] items-center">
                                        <h6 className="font-medium text-[16px] text-etBlack">Share:</h6>
                                        <div className="flex gap-[15px] text-[16px]">
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#757277] hover:text-etBlue"
                                            >
                                                <i className="fa-brands fa-facebook-f"></i>
                                            </a>
                                            <a
                                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(newsDetails.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#757277] hover:text-etBlue"
                                            >
                                                <i className="fa-brands fa-twitter"></i>
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(newsDetails.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#757277] hover:text-etBlue"
                                            >
                                                <i className="fa-brands fa-linkedin-in"></i>
                                            </a>
                                            <a
                                                href={`https://www.youtube.com/`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#757277] hover:text-etBlue"
                                            >
                                                <i className="fa-brands fa-youtube"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {newsDetails.Event && (
                                    <div id="et-event-tab1" className="et-tab active">
                                        <h2 className="text-[28px] sm:text-[24px] font-semibold text-etBlack mb-[20px] border-l-4 border-etBlue pl-[12px]">
                                            Événement lié à la news
                                        </h2>
                                        <div className="all-scheduled-events space-y-[20px]">
                                            <div
                                                key={newsDetails.Event.id}
                                                className="et-schedule flex md:flex-wrap gap-x-[20px] gap-y-[15px] justify-between sm:justify-center rounded-[15px]"
                                            >
                                                <div className="w-[220px] h-[182px] rounded-[15px] overflow-hidden shadow-md">
                                                    <img
                                                        src={`http://localhost:8080${newsDetails.Event.EventImages?.[0]?.image_url || '/default-event.jpg'}`}
                                                        alt="event cover"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>

                                                <div className="px-[20px] sm:px-[15px] py-[20px] shadow-md w-full rounded-[15px] flex gap-y-[10px] xs:flex-col items-center bg-white transition duration-300 hover:shadow-lg">
                                                    <div className="et-schedule__heading pr-[25px] sm:pr-[15px] min-w-[450px] sm:min-w-0 xs:pr-0 mr-[25px] sm:mr-[15px] xs:mr-0 border-r xs:border-r-0 border-[#d9d9d9]">
                                                        <div className="et-schedule-date-time border border-gray-300 py-[5px] px-[10px] rounded-full inline-flex items-center gap-x-[12px] gap-y-[6px] mb-[8px] text-sm bg-gray-50 animate-fade-in">
                                                            <div className="date flex items-center gap-[6px]">
                                                                <span className="icon">📅</span>
                                                                <span className="text-etGray">
                                                                    {new Date(newsDetails.Event.start_time).toLocaleDateString('fr-FR')} à {new Date(newsDetails.Event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <h3 className="et-schedule-title text-[18px] sm:text-[16px] font-medium text-etBlack leading-tight mb-1 mt-1 anim-text transition duration-300 hover:text-etBlue">
                                                            <a href={`/event/${newsDetails.Event.id}`}>{newsDetails.Event.title}</a>
                                                        </h3>

                                                        <div className="flex items-center gap-[10px] text-etGray text-[14px]">
                                                            <span className="text-xs text-gray-500 font-semibold">Organisé par :</span>
                                                            <a
                                                                href={`/profile/${newsDetails.User?.id}`}
                                                                className="flex items-center gap-[6px] hover:text-etBlue transition"
                                                            >
                                                                <img
                                                                    src={`http://localhost:8080${newsDetails.User?.profile_image}`}
                                                                    alt="user"
                                                                    className="w-[28px] h-[28px] rounded-full object-cover border border-gray-300"
                                                                />
                                                                <span className="text-sm">{newsDetails.User?.name} {newsDetails.User?.lastname}</span>
                                                            </a>
                                                        </div>

                                                        <div
                                                            className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
                                                            ${newsDetails.Event.status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
                                                            ${newsDetails.Event.status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
                                                            ${newsDetails.Event.status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
                                                            ${newsDetails.Event.status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
                                                            `}
                                                        >
                                                            {newsDetails.Event.status || 'Planifié'}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-y-[10px] items-center">
                                                        <div className="flex shrink-0 items-center">
                                                            <a
                                                                href={`/event/${newsDetails.Event.id}`}
                                                                className="et-btn border border-etBlue text-etBlue inline-flex items-center justify-center gap-x-2 h-[36px] px-4 text-sm rounded-full transition hover:bg-etBlue hover:text-white"
                                                            >
                                                                Voir l’événement
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            <div class="right max-w-full w-[370px] lg:w-[360px] shrink-0 space-y-[30px] md:space-y-[25px]">
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
            </main >
            < Footer />
        </>
    )
}

export default NewsDetails