import React from 'react';

function NewsDetailsRight({
    latestNews
}) {
    return (
        <div class="right max-w-full w-[370px] lg:w-[360px] shrink-0 space-y-[30px] md:space-y-[25px]">
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
    );
}

export default NewsDetailsRight;