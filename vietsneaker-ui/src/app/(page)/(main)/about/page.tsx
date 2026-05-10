import React from 'react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[400px] bg-black flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="/images/home_banner.png" 
                        alt="About Us" 
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="relative text-center space-y-4">
                    <h1 className="text-5xl font-black uppercase tracking-tighter">VietSneaker</h1>
                    <p className="text-xl font-light tracking-widest text-gray-300">Đẳng Cấp Trên Từng Bước Chân</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto py-20 px-6 space-y-16">
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold border-l-4 border-red-600 pl-4">Câu Chuyện Của Chúng Tôi</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Ra đời từ niềm đam mê mãnh liệt với văn hóa Sneaker, VietSneaker không chỉ là một cửa hàng giày, 
                        mà là nơi kết nối những tâm hồn yêu cái đẹp và sự năng động. Chúng tôi bắt đầu từ một cửa hàng nhỏ 
                        tại trung tâm thành phố với sứ mệnh mang những đôi giày chính hãng tốt nhất đến tay người tiêu dùng Việt Nam.
                    </p>
                </section>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-red-600">Tầm Nhìn</h3>
                        <p className="text-gray-600">
                            Trở thành hệ thống phân phối giày Sneaker 2hand và chính hãng hàng đầu Việt Nam, 
                            xây dựng cộng đồng yêu giày văn minh và bền vững.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-red-600">Giá Trị Cốt Lõi</h3>
                        <p className="text-gray-600">
                            Chất lượng là ưu tiên số 1. Sự hài lòng của khách hàng là thước đo thành công của chúng tôi. 
                            Minh bạch trong nguồn gốc và tình trạng sản phẩm.
                        </p>
                    </div>
                </div>

                <section className="bg-gray-50 p-10 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-3xl font-bold text-center">Tại sao chọn VietSneaker?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6">
                        {[
                            { title: 'Chính Hãng', desc: 'Cam kết 100%' },
                            { title: 'Giá Tốt', desc: 'Cạnh tranh nhất' },
                            { title: 'Bảo Hành', desc: 'Lên đến 12 tháng' },
                            { title: 'Đổi Trả', desc: 'Trong 7 ngày' }
                        ].map((item, i) => (
                            <div key={i} className="text-center space-y-2">
                                <div className="text-2xl font-black text-gray-800">{item.title}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="text-center space-y-8 py-10">
                    <h2 className="text-3xl font-bold">Bạn đã sẵn sàng để nổi bật?</h2>
                    <a href="/search" className="inline-block px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-red-600 transition-colors">
                        Khám Phá Cửa Hàng Ngay
                    </a>
                </section>
            </div>
        </div>
    );
}
