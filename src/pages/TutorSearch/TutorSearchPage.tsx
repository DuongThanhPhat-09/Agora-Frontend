import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// SVG Icons
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.625 17.5C13.9773 17.5 17.5 13.9773 17.5 9.625C17.5 5.27269 13.9773 1.75 9.625 1.75C5.27269 1.75 1.75 5.27269 1.75 9.625C1.75 13.9773 5.27269 17.5 9.625 17.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.25 19.25L15.3125 15.3125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CategoryIcon = () => (
    <svg width="13" height="13" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.08333 2.125H2.125V7.08333H7.08333V2.125Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.875 2.125H9.91667V7.08333H14.875V2.125Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.875 9.91667H9.91667V14.875H14.875V9.91667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.08333 9.91667H2.125V14.875H7.08333V9.91667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const VerifiedIcon = () => (
    <svg width="7" height="7" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 2.625L3.5625 6.5625L1.5 4.5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UniversityIcon = () => (
    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 1L1 3.5L6.5 6L12 3.5L6.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 3.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="6" height="4.5" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 4L4 7L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowIcon = () => (
    <svg width="9" height="4" viewBox="0 0 12 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 2H11M11 2L9 0.5M11 2L9 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FilterIcon = () => (
    <svg width="9" height="9" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.8333 1.16667H1.16667L5.83333 6.69083V10.5L8.16667 11.6667V6.69083L12.8333 1.16667Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Categories data
const categories = [
    { id: "all", name: "Tất cả", icon: <CategoryIcon /> },
    { id: "science", name: "Khoa học", icon: <CategoryIcon /> },
    { id: "language", name: "Ngôn ngữ", icon: <CategoryIcon /> },
    { id: "art", name: "Nghệ thuật", icon: <CategoryIcon /> },
    { id: "tech", name: "IT & Tech", icon: <CategoryIcon /> },
];

// Trending tags
const trendingTags = ["SAT Prep", "Calculus III", "UX Design", "Ancient History"];

// Tutor types
type TutorType = "intensive" | "guided" | "basic" | "elite";

interface Tutor {
    id: number;
    name: string;
    avatar: string;
    type: TutorType;
    credential: string;
    rating: number;
    university: string;
    subjects: string[];
    experience: string;
    result: string;
    resultType: "success" | "primary" | "muted" | "warning";
    highlights: string[];
    price: number;
}

// Sample tutors data
const tutors: Tutor[] = [
    {
        id: 1,
        name: "Sarah Jenkins",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        type: "intensive",
        credential: "PhD Candidate",
        rating: 4.9,
        university: "ĐH Khoa học Tự nhiên",
        subjects: ["Luyện thi ĐH", "Toán Lý"],
        experience: "5 Năm",
        result: "98% A/B",
        resultType: "success",
        highlights: ["Cam kết tiến độ qua LMS Report", "Dạy thử đánh giá năng lực 30'"],
        price: 45,
    },
    {
        id: 2,
        name: "David Chen",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        type: "guided",
        credential: "M.Sc Math",
        rating: 5.0,
        university: "Stanford University",
        subjects: ["Toán SAT 11", "AP Calculus", "ACT Math"],
        experience: "7 Năm",
        result: "100%",
        resultType: "primary",
        highlights: ["Chuyên luyện thi chứng chỉ SAT/ACT", "Báo cáo tuần chi tiết cho phụ huynh"],
        price: 60,
    },
    {
        id: 3,
        name: "David Chen",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        type: "guided",
        credential: "M.Sc Math",
        rating: 5.0,
        university: "Stanford University",
        subjects: ["Toán SAT 11", "AP Calculus", "ACT Math"],
        experience: "7 Năm",
        result: "100%",
        resultType: "primary",
        highlights: ["Chuyên luyện thi chứng chỉ SAT/ACT", "Báo cáo tuần chi tiết cho phụ huynh"],
        price: 60,
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        type: "basic",
        credential: "TESOL Cert.",
        rating: 4.8,
        university: "Cambridge CELTA",
        subjects: ["IELTS Academic", "Giao tiếp", "Español"],
        experience: "4 Năm",
        result: "Quốc tế",
        resultType: "muted",
        highlights: ["Song ngữ Anh - Tây Ban Nha", "Cam kết chuẩn đầu ra IELTS"],
        price: 35,
    },
    {
        id: 5,
        name: "Elena Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        type: "basic",
        credential: "TESOL Cert.",
        rating: 4.8,
        university: "Cambridge CELTA",
        subjects: ["IELTS Academic", "Giao tiếp", "Español"],
        experience: "4 Năm",
        result: "Quốc tế",
        resultType: "muted",
        highlights: ["Song ngữ Anh - Tây Ban Nha", "Cam kết chuẩn đầu ra IELTS"],
        price: 35,
    },
    {
        id: 6,
        name: "GS. James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        type: "elite",
        credential: "Retired",
        rating: 5.0,
        university: "ĐH Cambridge",
        subjects: ["Lịch sử TG", "Viết luận", "Khoa học XH"],
        experience: "30 Năm",
        result: "Viết luận",
        resultType: "warning",
        highlights: ["Cố vấn viết luận văn/hồ sơ du học", "Xác minh đặc biệt bởi AGORA"],
        price: 75,
    },
];

// Type labels
const typeLabels: Record<TutorType, string> = {
    intensive: "INTENSIVE TUTOR",
    guided: "GUIDED TUTOR",
    basic: "BASIC TUTOR",
    elite: "ELITE TUTOR",
};

// Stats labels based on type
const statsLabels: Record<TutorType, { experience: string; result: string }> = {
    intensive: { experience: "THÂM NIÊN", result: "KẾT QUẢ" },
    guided: { experience: "THÂM NIÊN", result: "HÀI LÒNG" },
    basic: { experience: "THÂM NIÊN", result: "CHỨNG CHỈ" },
    elite: { experience: "THÂM NIÊN", result: "CHUYÊN MÔN" },
};

// Search Hero Section
const SearchHero = () => (
    <section className="search-hero">
        <div className="search-hero-gradient"></div>
        <div className="search-hero-content">
            <div className="search-hero-text">
                <h1 className="search-hero-title">
                    Hôm nay bạn muốn<br />
                    <span className="highlight">khai phá tri thức</span> gì?
                </h1>
                <p className="search-hero-subtitle">
                    Kể cho Agora nghe về mục tiêu học tập của bạn, chúng tôi sẽ tìm người đồng<br />
                    hành phù hợp nhất.
                </p>
            </div>
            <div className="search-container">
                <div className="search-bar">
                    <div className="search-icon">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm gia sư toán, IELTS, luyện thi đại học..."
                    />
                    <button className="btn-search">Tìm kiếm</button>
                </div>
                <div className="trending-container">
                    <span className="trending-label">Trending:</span>
                    {trendingTags.map((tag, index) => (
                        <button
                            key={index}
                            className={`trending-tag ${index === 0 ? '' : 'muted'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

// Category Tabs Section
const CategoryTabs = () => {
    const [activeCategory, setActiveCategory] = useState("all");

    return (
        <section className="category-section">
            <div className="category-tabs">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        <span className="category-tab-icon">{category.icon}</span>
                        <span className="category-tab-text">{category.name}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

// Filter Bar Section
const FilterBar = () => (
    <section className="filter-section">
        <div className="filter-container">
            <div className="filter-groups">
                <div className="filter-group">
                    <span className="filter-label">Cấp học</span>
                    <div className="filter-select-wrapper">
                        <select className="filter-select">
                            <option>Tiểu học</option>
                            <option>THCS</option>
                            <option>THPT</option>
                            <option>Đại học</option>
                        </select>
                    </div>
                </div>
                <div className="filter-divider"></div>
                <div className="filter-group">
                    <span className="filter-label">Ngân sách</span>
                    <div className="filter-select-wrapper">
                        <select className="filter-select">
                            <option>MỌI GIÁ</option>
                            <option>Dưới $30/h</option>
                            <option>$30 - $50/h</option>
                            <option>Trên $50/h</option>
                        </select>
                    </div>
                </div>
                <div className="filter-divider"></div>
                <div className="filter-group">
                    <span className="filter-label">Hình thức</span>
                    <div className="filter-select-wrapper">
                        <select className="filter-select">
                            <option>ONLINE</option>
                            <option>OFFLINE</option>
                            <option>HYBRID</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="filter-actions">
                <div className="sort-group">
                    <span className="sort-label">Sort by</span>
                    <div className="sort-select-wrapper">
                        <select className="sort-select">
                            <option>ĐÁNH GIÁ CAO NHẤT</option>
                            <option>GIÁ THẤP NHẤT</option>
                            <option>KINH NGHIỆM</option>
                        </select>
                    </div>
                </div>
                <button className="btn-filter">
                    <span className="btn-filter-icon"><FilterIcon /></span>
                    <span className="btn-filter-text">Filters</span>
                </button>
            </div>
        </div>
    </section>
);

// Tutor Card Component
interface TutorCardProps {
    tutor: Tutor;
}

const TutorCard = ({ tutor }: TutorCardProps) => (
    <div className="tutor-card">
        <div className="tutor-card-body">
            {/* Header Row */}
            <div className="tutor-card-header">
                <div className="tutor-profile">
                    <div className="tutor-avatar-container">
                        <img src={tutor.avatar} alt={tutor.name} className="tutor-avatar" />
                        <div className="tutor-verified-badge">
                            <VerifiedIcon />
                        </div>
                    </div>
                    <div className="tutor-info">
                        <h3 className="tutor-name">{tutor.name}</h3>
                        <div className="tutor-badges">
                            <span className={`tutor-type-badge ${tutor.type}`}>
                                {typeLabels[tutor.type]}
                            </span>
                            <span className="tutor-credential">{tutor.credential}</span>
                        </div>
                    </div>
                </div>
                <div className="tutor-rating">
                    <span className="rating-star">★</span>
                    <span className="rating-value">{tutor.rating.toFixed(1)}</span>
                </div>
            </div>

            {/* University Row */}
            <div className="tutor-university-row">
                <span className="university-icon"><UniversityIcon /></span>
                <span className="university-name">{tutor.university}</span>
                <div className="class-type-badge">
                    <span className="class-type-label">Loại lớp:</span>
                    <span className={`class-type-value ${tutor.type}`}>
                        {tutor.type.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Subject Tags */}
            <div className="tutor-subjects">
                {tutor.subjects.map((subject, index) => (
                    <span key={index} className="subject-tag">{subject}</span>
                ))}
            </div>

            {/* Stats Row */}
            <div className="tutor-stats">
                <div className="stat-item">
                    <span className="stat-label">{statsLabels[tutor.type].experience}</span>
                    <span className="stat-value">{tutor.experience}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">{statsLabels[tutor.type].result}</span>
                    <span className={`stat-value ${tutor.resultType}`}>{tutor.result}</span>
                </div>
            </div>

            {/* Highlights */}
            <div className="tutor-highlights">
                {tutor.highlights.map((highlight, index) => (
                    <div key={index} className="highlight-item">
                        <span className="highlight-icon"><CheckIcon /></span>
                        <span className="highlight-text">{highlight}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Card Footer */}
        <div className="tutor-card-footer">
            <div className="tutor-pricing">
                <span className="pricing-label">HỌC PHÍ CHUẨN</span>
                <div className="pricing-value">
                    <span className="price-amount">${tutor.price}</span>
                    <span className="price-unit">/h</span>
                </div>
            </div>
            <div className="tutor-actions">
                <button className="btn-details">Chi tiết</button>
                <button className="btn-start-plan">
                    <span className="btn-start-plan-text">BẮT ĐẦU KẾ HOẠCH</span>
                    <span className="btn-start-plan-icon"><ArrowIcon /></span>
                </button>
            </div>
        </div>
    </div>
);

// Results Section
const ResultsSection = () => {
    // Split tutors into rows of 3
    const firstRow = tutors.slice(0, 3);
    const secondRow = tutors.slice(3, 6);

    return (
        <section className="results-section">
            <div className="results-header">
                <div className="results-header-left">
                    <span className="results-label">Agora Selection</span>
                    <h2 className="results-title">Chuyên gia đang online</h2>
                </div>
                <span className="results-count">{tutors.length} Kết quả tìm thấy</span>
            </div>
            <div className="tutor-grid">
                <div className="tutor-row">
                    {firstRow.map((tutor) => (
                        <TutorCard key={tutor.id} tutor={tutor} />
                    ))}
                </div>
                <div className="tutor-row">
                    {secondRow.map((tutor) => (
                        <TutorCard key={tutor.id} tutor={tutor} />
                    ))}
                </div>
            </div>
            <div className="load-more-container">
                <button className="btn-load-more">Khám phá thêm</button>
            </div>
        </section>
    );
};



// Main TutorSearchPage Component
const TutorSearchPage = () => {
    return (
        <div className="tutor-search-page">
            <Header />
            <main>
                <SearchHero />
                <CategoryTabs />
                <FilterBar />
                <ResultsSection />
            </main>
            <Footer />
        </div>
    );
};

export default TutorSearchPage;
