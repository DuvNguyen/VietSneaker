import React from 'react';
import Link from 'next/link';

const Banner: React.FC = () => {
    return (
        <div className="relative w-full h-[600px] overflow-hidden group">
            {/* Background Image with Parallax Effect */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/images/home_banner.png')" }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative h-full lg:w-3/4 mx-auto flex flex-col justify-center px-6 md:px-12 text-white">
                <div className="max-w-2xl space-y-6">
                    <span className="inline-block px-4 py-1 rounded-full bg-red-600 text-xs font-bold tracking-widest uppercase animate-fade-in">
                        VietSneaker Collection 2025
                    </span>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-2xl">
                        Nâng Tầm <br />
                        <span className="text-red-500">Phong Cách</span> Của Bạn
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-200 max-w-lg drop-shadow-lg leading-relaxed">
                        Khám phá bộ sưu tập Sneaker chính hãng, đa dạng mẫu mã từ các thương hiệu hàng đầu thế giới. 
                        Cam kết chất lượng, giá tốt nhất thị trường.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link href="/search">
                            <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-xl">
                                Mua Ngay
                            </button>
                        </Link>
                        <Link href="/about">
                            <button className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white transition-all duration-300">
                                Tìm Hiểu Thêm
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute bottom-10 right-10 hidden md:block">
                <div className="flex items-center gap-4 text-white/50 text-sm font-medium tracking-widest uppercase vertical-rl rotate-180">
                    <div className="w-1 h-20 bg-white/20 relative">
                        <div className="absolute top-0 w-full h-1/2 bg-red-600 animate-scroll-down" />
                    </div>
                    Scroll Down
                </div>
            </div>
        </div>
    );
};

export default Banner;
