import React from 'react';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/';

function NewsDetailsRight({
    latestNews
}) {
    return (
        <div class="right space-y-[30px] md:space-y-[25px] w-[370px] lg:w-[360px] max-w-full shrink-0">
            <div className="px-[30px] xxs:px-[20px] pt-[30px] xxs:pt-[20px] pb-[40px] xxs:pb-[30px] border border-[#e5e5e5] rounded-[10px]">
                <h4 className="before:-bottom-[5px] before:left-0 before:absolute relative before:content-normal before:bg-[#CE22BF] mb-[5px] before:w-[50px] before:h-[2px] font-medium text-[24px] text-etBlack xxs:text-[20px]"> Actualités récents</h4>

                <div className="space-y-[24px] mt-[30px] posts">
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
                                        src={`${REACT_APP_API_BASE_URL}${post.image_url}`}
                                        alt="Post Image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div>
                                    <span className="flex items-center gap-[12px] mb-[3px] text-[14px] text-etGray date">
                                        <span className="icon">
                                            <i className="text-[#CE22BF] fa-solid fa-calendar-days"></i>
                                        </span>
                                        <span>{formattedDate}</span>
                                    </span>

                                    <h6 className="font-medium text-[15px] text-etBlack">
                                        <a href={`/news/${post.id}`} className="hover:text-[#CE22BF]">
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
    );
}

export default NewsDetailsRight;