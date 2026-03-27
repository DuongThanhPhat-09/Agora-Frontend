import { useState, useEffect, useCallback, useRef } from "react";
import { searchTutors } from "../../services/tutorSearch.service";
import type {
    TutorSearchResultResponse,
    TutorSearchParams,
} from "../../services/tutorSearch.service";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import "../../styles/pages/tutor-search.css";

// SVG Icons
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.625 17.5C13.9773 17.5 17.5 13.9773 17.5 9.625C17.5 5.27269 13.9773 1.75 9.625 1.75C5.27269 1.75 1.75 5.27269 1.75 9.625C1.75 13.9773 5.27269 17.5 9.625 17.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.25 19.25L15.3125 15.3125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

// Subject SVG Icons
const SubjectIcons = {
    all: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    math: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="19" y2="19"/></svg>,
    physics: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>,
    chemistry: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v7l5 8H4l5-8V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>,
    english: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    science: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
    language: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>,
    art: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7H16c3.3 0 6-2.7 6-6 0-5.5-4.5-9.6-10-9.6z"/></svg>,
    it_tech: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>,
};

const categories: { id: string; name: string; icon: React.ReactNode }[] = [
    { id: "all", name: "Tất cả", icon: SubjectIcons.all },
    { id: "math", name: "Toán Học", icon: SubjectIcons.math },
    { id: "physics", name: "Vật Lý", icon: SubjectIcons.physics },
    { id: "chemistry", name: "Hóa Học", icon: SubjectIcons.chemistry },
    { id: "english", name: "Tiếng Anh", icon: SubjectIcons.english },
    { id: "science", name: "Khoa Học", icon: SubjectIcons.science },
    { id: "language", name: "Ngoại Ngữ", icon: SubjectIcons.language },
    { id: "art", name: "Nghệ Thuật", icon: SubjectIcons.art },
    { id: "it_tech", name: "Công Nghệ", icon: SubjectIcons.it_tech },
];

// Trending tags
const trendingTags = ["Toán", "Vật Lý", "Hóa Học", "Tiếng Anh"];

// ============================================
// Filter options (khớp với backend TutorSearchParameters)
// ============================================
// Grade level options are defined as gradeLevelChips below

const budgetRangeOptions = [
    { value: "all", label: "MỌI GIÁ" },
    { value: "under_50", label: "Dưới 50.000đ/h" },
    { value: "50_100", label: "50.000đ - 100.000đ/h" },
    { value: "100_200", label: "100.000đ - 200.000đ/h" },
    { value: "200_500", label: "200.000đ - 500.000đ/h" },
    { value: "over_500", label: "Trên 500.000đ/h" },
];

const teachingModeOptions = [
    { value: "", label: "Tất cả" },
    { value: "online", label: "ONLINE" },
    { value: "offline", label: "OFFLINE" },
    { value: "hybrid", label: "LINH HOẠT" },
];

const cityOptions = [
    { value: "", label: "Tất cả" },
    { value: "hochiminh", label: "TP. Hồ Chí Minh" },
    { value: "hanoi", label: "Hà Nội" },
    { value: "danang", label: "Đà Nẵng" },
    { value: "cantho", label: "Cần Thơ" },
    { value: "haiphong", label: "Hải Phòng" },
    { value: "binhduong", label: "Bình Dương" },
    { value: "dongnai", label: "Đồng Nai" },
];

// Flat grade level options for chip buttons
const gradeLevelChips = [
    { value: "Grade_1", label: "Lớp 1" },
    { value: "Grade_2", label: "Lớp 2" },
    { value: "Grade_3", label: "Lớp 3" },
    { value: "Grade_4", label: "Lớp 4" },
    { value: "Grade_5", label: "Lớp 5" },
    { value: "Grade_6", label: "Lớp 6" },
    { value: "Grade_7", label: "Lớp 7" },
    { value: "Grade_8", label: "Lớp 8" },
    { value: "Grade_9", label: "Lớp 9" },
    { value: "Grade_10", label: "Lớp 10" },
    { value: "Grade_11", label: "Lớp 11" },
    { value: "Grade_12", label: "Lớp 12" },
];

const sortByOptions = [
    { value: "rating_desc", label: "ĐÁNH GIÁ CAO NHẤT" },
    { value: "price_asc", label: "GIÁ THẤP NHẤT" },
    { value: "price_desc", label: "GIÁ CAO NHẤT" },
    { value: "experience_desc", label: "KINH NGHIỆM" },
    { value: "reviews_desc", label: "ĐÁNH GIÁ NHIỀU NHẤT" },
    { value: "newest", label: "MỚI NHẤT" },
    { value: "popularity", label: "PHỔ BIẾN NHẤT" },
];

// ============================================
// Tutor types
// ============================================
type TutorType = "intensive" | "guided" | "basic" | "elite";

interface Tutor {
    id: string;
    name: string;
    avatar: string;
    type: TutorType;
    credential: string;
    rating: number;
    university: string;
    subjects: string[];
    gradeLevels: string[];
    experience: string;
    result: string;
    resultType: "success" | "primary" | "muted" | "warning";
    highlights: string[];
    price: number;
    trialLessonPrice: number | null;
}

// ============================================
// Helper: Map backend response → UI Tutor type
// ============================================
const mapSubscriptionToType = (sub: string | null | undefined): TutorType => {
    const map: Record<string, TutorType> = {
        intensive: "intensive",
        guided: "guided",
        basic: "basic",
        free: "basic",
        elite: "elite",
    };
    return map[(sub || "").toLowerCase()] || "basic";
};

const getResultType = (type: TutorType): "success" | "primary" | "muted" | "warning" => {
    const map: Record<TutorType, "success" | "primary" | "muted" | "warning"> = {
        intensive: "success",
        guided: "primary",
        basic: "muted",
        elite: "warning",
    };
    return map[type];
};

// Helper: Convert grade level keys (e.g. "Grade_6") to display labels ("Lớp 6")
const formatGradeLevel = (grade: string): string => {
    const match = grade.match(/^Grade_(\d+)$/i);
    if (match) return `Lớp ${match[1]}`;
    return grade;
};

// Helper: Convert sorted grade numbers into compact ranges (e.g. [1,2,3,6,7,8,9,10] → "Lớp 1-3, 6-10")
const formatGradeLevelRanges = (grades: string[]): string => {
    if (grades.length === 0) return "";
    
    // Extract numbers
    const nums = grades.map(g => {
        const m = g.match(/\d+/);
        return m ? parseInt(m[0]) : 0;
    }).filter(n => n > 0).sort((a, b) => a - b);
    
    if (nums.length === 0) return "";
    
    // Build ranges
    const ranges: string[] = [];
    let start = nums[0];
    let end = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === end + 1) {
            end = nums[i];
        } else {
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
            start = nums[i];
            end = nums[i];
        }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    
    return `Lớp ${ranges.join(", ")}`;
};

const mapApiTutorToUi = (apiTutor: TutorSearchResultResponse): Tutor => {
    const type = mapSubscriptionToType(apiTutor.subscriptionType);

    // Build subjects array — only show subjectName (e.g. "Toán Học")
    const subjects: string[] = [];
    const gradeLevelSet = new Set<string>();
    if (apiTutor.subjects) {
        apiTutor.subjects.forEach((s) => {
            // Only add the subject name
            if (s.subjectName && !subjects.includes(s.subjectName)) {
                subjects.push(s.subjectName);
            }
            // Collect grade levels from each subject (only Grade_1 to Grade_12)
            if (s.gradeLevels) {
                s.gradeLevels.forEach((gl) => {
                    if (/^Grade_(\d+)$/i.test(gl)) {
                        const num = parseInt(gl.match(/^Grade_(\d+)$/i)![1]);
                        if (num >= 1 && num <= 12) {
                            gradeLevelSet.add(gl);
                        }
                    }
                });
            }
        });
    }

    // Sort grade levels numerically and format
    const sortedGradeLevels = Array.from(gradeLevelSet)
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)![0]);
            const numB = parseInt(b.match(/\d+/)![0]);
            return numA - numB;
        })
        .map(formatGradeLevel);

    return {
        id: apiTutor.tutorId,
        name: apiTutor.fullName || "Gia sư",
        avatar: apiTutor.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
        type,
        credential: apiTutor.degreeLevel || "",
        rating: apiTutor.averageRating || 0,
        university: apiTutor.education || "",
        subjects: subjects.length > 0 ? subjects : ["Chưa cập nhật"],
        gradeLevels: sortedGradeLevels,
        experience: apiTutor.yearsOfExperience ? `${apiTutor.yearsOfExperience} Năm` : "N/A",
        result: apiTutor.successRate || apiTutor.specialty || "—",
        resultType: getResultType(type),
        highlights: apiTutor.highlights || [],
        price: apiTutor.hourlyRate ? Math.round(Number(apiTutor.hourlyRate) * 1.05) : 0,
        trialLessonPrice: apiTutor.trialLessonPrice ?? null,
    };
};

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

// ============================================
// Search filters state type
// ============================================
interface SearchFilters {
    searchTerm: string;
    categories: string[];
    gradeLevels: string[];
    budgetRange: string;
    teachingMode: string;
    city: string;
    sortBy: string;
    pageNumber: number;
    pageSize: number;
}

const defaultFilters: SearchFilters = {
    searchTerm: "",
    categories: [],
    gradeLevels: [],
    budgetRange: "all",
    teachingMode: "",
    city: "",
    sortBy: "rating_desc",
    pageNumber: 1,
    pageSize: 10,
};

// ============================================
// Search Hero Section
// ============================================
interface SearchHeroProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    onSearch: () => void;
    onTrendingClick: (tag: string) => void;
}

const SearchHero = ({ searchTerm, onSearchTermChange, onSearch, onTrendingClick }: SearchHeroProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <section className="search-hero">
            <div className="search-hero-gradient"></div>
            <div className="search-hero-content">
                <div className="search-hero-text">
                    <h1 className="search-hero-title">
                        Hôm nay bạn muốn<br />
                        <span className="highlight">khai phá tri thức</span> gì?
                    </h1>
                    <p className="search-hero-subtitle">
                        Kể cho TUTORA nghe về mục tiêu học tập của bạn, chúng tôi sẽ tìm người đồng<br />
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
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="btn-search" onClick={onSearch}>Tìm kiếm</button>
                    </div>
                    <div className="trending-container">
                        <span className="trending-label">Trending:</span>
                        {trendingTags.map((tag, index) => (
                            <button
                                key={index}
                                className={`trending-tag ${index === 0 ? '' : 'muted'}`}
                                onClick={() => onTrendingClick(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ============================================
// Category Tabs Section — Expandable Subject Selector
// ============================================
interface CategoryTabsProps {
    activeCategories: string[];
    onCategoryToggle: (category: string) => void;
}

const CategoryTabs = ({ activeCategories, onCategoryToggle }: CategoryTabsProps) => {
    const [showSubjects, setShowSubjects] = useState(false);

    // Build display label
    const getLabel = () => {
        if (activeCategories.length === 0) return 'Tất cả';
        if (activeCategories.length === 1) return categories.find(c => c.id === activeCategories[0])?.name || 'Tất cả';
        return `${activeCategories.length} môn`;
    };

    // Get icon for display
    const getIcon = () => {
        if (activeCategories.length === 1) {
            return categories.find(c => c.id === activeCategories[0])?.icon || SubjectIcons.all;
        }
        return SubjectIcons.all;
    };

    return (
        <section className="category-section">
            <div className="category-header">
                <button
                    className={`category-toggle-btn ${showSubjects ? 'open' : ''}`}
                    onClick={() => setShowSubjects(!showSubjects)}
                >
                    <span className="category-toggle-icon">{getIcon()}</span>
                    <span className="category-toggle-label">
                        Môn học: <strong>{getLabel()}</strong>
                    </span>
                    <svg className="category-toggle-arrow" width="12" height="7" viewBox="0 0 12 7" fill="none" style={{ transform: showSubjects ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            {showSubjects && (
                <div className="category-dropdown">
                    {categories.map((category) => {
                        const isAll = category.id === 'all';
                        const isActive = isAll ? activeCategories.length === 0 : activeCategories.includes(category.id);
                        return (
                            <button
                                key={category.id}
                                className={`category-option ${isActive ? 'active' : ''}`}
                                onClick={() => {
                                    if (isAll) {
                                        // "Tất cả" clears all selections
                                        onCategoryToggle('all');
                                    } else {
                                        onCategoryToggle(category.id);
                                    }
                                }}
                            >
                                <span className="category-option-icon">{category.icon}</span>
                                <span className="category-option-text">{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

// ============================================
// Filter Bar Section
// ============================================
interface FilterBarProps {
    gradeLevels: string[];
    budgetRange: string;
    teachingMode: string;
    city: string;
    sortBy: string;
    onGradeLevelToggle: (value: string) => void;
    onBudgetRangeChange: (value: string) => void;
    onTeachingModeChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onSortByChange: (value: string) => void;
    onResetFilters: () => void;
}

const FilterBar = ({
    gradeLevels,
    budgetRange,
    teachingMode,
    city,
    sortBy,
    onGradeLevelToggle,
    onBudgetRangeChange,
    onTeachingModeChange,
    onCityChange,
    onSortByChange,
    onResetFilters,
}: FilterBarProps) => {
    const [showGrades, setShowGrades] = useState(false);
    const hasActiveFilters = gradeLevels.length > 0 || budgetRange !== "all" || teachingMode !== "" || city !== "" || sortBy !== "rating_desc";

    // Build grade level display label
    const getGradeLabel = () => {
        if (gradeLevels.length === 0) return 'Tất cả';
        if (gradeLevels.length === 1) return gradeLevelChips.find(g => g.value === gradeLevels[0])?.label || 'Tất cả';
        return `${gradeLevels.length} lớp`;
    };

    return (
        <section className="filter-section">
            <div className="filter-container">
                {/* Row 1: Main filter dropdowns */}
                <div className="filter-row-main">
                    <div className="filter-groups">
                        <div className="filter-group">
                            <span className="filter-label">Cấp học</span>
                            <button
                                className={`filter-toggle-btn ${showGrades ? 'active' : ''} ${gradeLevels.length > 0 ? 'has-value' : ''}`}
                                onClick={() => setShowGrades(!showGrades)}
                            >
                                <span>{getGradeLabel()}</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: showGrades ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="filter-divider"></div>
                        <div className="filter-group">
                            <span className="filter-label">Khu vực</span>
                            <CustomDropdown
                                variant="filter"
                                value={city}
                                onChange={onCityChange}
                                options={cityOptions}
                            />
                        </div>
                        <div className="filter-divider"></div>
                        <div className="filter-group">
                            <span className="filter-label">Ngân sách</span>
                            <CustomDropdown
                                variant="filter"
                                value={budgetRange}
                                onChange={onBudgetRangeChange}
                                options={budgetRangeOptions}
                            />
                        </div>
                        <div className="filter-divider"></div>
                        <div className="filter-group">
                            <span className="filter-label">Hình thức</span>
                            <CustomDropdown
                                variant="filter"
                                value={teachingMode}
                                onChange={onTeachingModeChange}
                                options={teachingModeOptions}
                            />
                        </div>
                    </div>
                    <div className="filter-actions">
                        <div className="sort-group">
                            <span className="sort-label">Sort by</span>
                            <CustomDropdown
                                variant="sort"
                                value={sortBy}
                                onChange={onSortByChange}
                                options={sortByOptions}
                            />
                        </div>
                        <button className="btn-filter" onClick={onResetFilters} title={hasActiveFilters ? "Xóa bộ lọc" : "Bộ lọc"}>
                            <span className="btn-filter-icon"><FilterIcon /></span>
                            <span className="btn-filter-text">{hasActiveFilters ? "Xóa lọc" : "Filters"}</span>
                        </button>
                    </div>
                </div>

                {/* Row 2: Expandable grade level chips — multi-select */}
                {showGrades && (
                    <div className="grade-chips-row">
                        <button
                            className={`grade-chip ${gradeLevels.length === 0 ? 'active' : ''}`}
                            onClick={() => onGradeLevelToggle('all')}
                        >
                            Tất cả
                        </button>
                        {gradeLevelChips.map((chip) => (
                            <button
                                key={chip.value}
                                className={`grade-chip ${gradeLevels.includes(chip.value) ? 'active' : ''}`}
                                onClick={() => onGradeLevelToggle(chip.value)}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

// ============================================
// Active Filter Chips — shows selected filters with remove buttons
// ============================================
interface ActiveFiltersProps {
    categories: string[];
    gradeLevels: string[];
    onRemoveCategory: (category: string) => void;
    onRemoveGradeLevel: (gradeLevel: string) => void;
    onClearAll: () => void;
}

const ActiveFilters = ({ categories, gradeLevels, onRemoveCategory, onRemoveGradeLevel, onClearAll }: ActiveFiltersProps) => {
    const hasAny = categories.length > 0 || gradeLevels.length > 0;
    if (!hasAny) return null;

    return (
        <div className="active-filters-bar">
            <div className="active-filters-container">
                <span className="active-filters-label">Bộ lọc đang chọn:</span>
                <div className="active-filters-chips">
                    {categories.map(catId => {
                        const catDef = [
                            { id: 'math', name: 'Toán Học' },
                            { id: 'physics', name: 'Vật Lý' },
                            { id: 'chemistry', name: 'Hóa Học' },
                            { id: 'english', name: 'Tiếng Anh' },
                            { id: 'science', name: 'Khoa Học' },
                            { id: 'language', name: 'Ngoại Ngữ' },
                            { id: 'art', name: 'Nghệ Thuật' },
                            { id: 'it_tech', name: 'Công Nghệ' },
                        ].find(c => c.id === catId);
                        return (
                            <span key={`cat-${catId}`} className="active-filter-chip category-chip">
                                {catDef?.name || catId}
                                <button className="chip-remove" onClick={() => onRemoveCategory(catId)} aria-label="Remove">
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                        <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </span>
                        );
                    })}
                    {gradeLevels.map(gl => {
                        const chip = gradeLevelChips.find(g => g.value === gl);
                        return (
                            <span key={`gl-${gl}`} className="active-filter-chip grade-chip">
                                {chip?.label || gl}
                                <button className="chip-remove" onClick={() => onRemoveGradeLevel(gl)} aria-label="Xóa">
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                        <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </span>
                        );
                    })}
                </div>
                <button className="active-filters-clear" onClick={onClearAll}>
                    Xóa tất cả
                </button>
            </div>
        </div>
    );
};

// ============================================
// Tutor Card Component
// ============================================
interface TutorCardProps {
    tutor: Tutor;
}

const TutorCard = ({ tutor }: TutorCardProps) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/tutor-detail/${tutor.id}`);
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click from firing
        navigate(`/tutor-detail/${tutor.id}`);
    };

    return (
        <div className="tutor-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
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

                {/* Subject Tags + Grade Levels combined */}
                <div className="tutor-subjects">
                    {tutor.subjects.map((subject, index) => (
                        <span key={index} className="subject-tag">{subject}</span>
                    ))}
                </div>

                {/* Grade Levels — compact range display */}
                {tutor.gradeLevels.length > 0 && (
                    <div className="tutor-grade-levels">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0, color: '#2563eb'}}>
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                        <span className="grade-level-range">
                            {formatGradeLevelRanges(tutor.gradeLevels)}
                        </span>
                    </div>
                )}

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

                {/* Highlights — max 2 */}
                {tutor.highlights.length > 0 && (
                <div className="tutor-highlights">
                    {tutor.highlights.slice(0, 2).map((highlight, index) => (
                        <div key={index} className="highlight-item">
                            <span className="highlight-icon"><CheckIcon /></span>
                            <span className="highlight-text">{highlight}</span>
                        </div>
                    ))}
                </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="tutor-card-footer">
                <div className="tutor-pricing">
                    <span className="pricing-label">HỌC PHÍ CHUẨN</span>
                    <div className="pricing-value">
                        <span className="price-amount">{tutor.price.toLocaleString('vi-VN')}đ</span>
                        <span className="price-unit">/h</span>
                    </div>
                    {tutor.trialLessonPrice != null && tutor.trialLessonPrice > 0 && (
                        <div className="trial-price-badge" title="Học phí ưu đãi cho buổi học đầu tiên">
                            ✨ Học thử: {tutor.trialLessonPrice.toLocaleString('vi-VN')}đ
                        </div>
                    )}
                </div>
                <div className="tutor-actions">
                    <button className="btn-details" onClick={handleButtonClick}>Chi tiết</button>
                    <button className="btn-start-plan" onClick={handleButtonClick}>
                        <span className="btn-start-plan-text">BẮT ĐẦU KẾ HOẠCH</span>
                        <span className="btn-start-plan-icon"><ArrowIcon /></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// Results Section (Dumb Component — chỉ hiển thị)
// ============================================
interface ResultsSectionProps {
    tutors: Tutor[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    hasNext: boolean;
    onLoadMore: () => void;
}

const ResultsSection = ({ tutors, loading, error, totalCount, hasNext, onLoadMore }: ResultsSectionProps) => {
    // Split tutors into rows of 3
    const rows: Tutor[][] = [];
    for (let i = 0; i < tutors.length; i += 3) {
        rows.push(tutors.slice(i, i + 3));
    }

    if (loading && tutors.length === 0) {
        return (
            <section className="results-section">
                <div className="results-header">
                    <div className="results-header-left">
                        <span className="results-label">TUTORA Selection</span>
                        <h2 className="results-title">Đang tải...</h2>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="results-section">
                <div className="results-header">
                    <div className="results-header-left">
                        <span className="results-label">TUTORA Selection</span>
                        <h2 className="results-title" style={{ color: '#ef4444' }}>{error}</h2>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="results-section">
            <div className="results-header">
                <div className="results-header-left">
                    <span className="results-label">TUTORA Selection</span>
                    <h2 className="results-title">Chuyên gia đang online</h2>
                </div>
                <span className="results-count">{totalCount} Kết quả tìm thấy</span>
            </div>
            <div className="tutor-grid">
                {rows.map((row, rowIndex) => (
                    <div className="tutor-row" key={rowIndex}>
                        {row.map((tutor, index) => (
                            <TutorCard key={`${tutor.id}-${index}`} tutor={tutor} />
                        ))}
                    </div>
                ))}
            </div>
            {tutors.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                    <p style={{ fontSize: '16px' }}>Không tìm thấy gia sư phù hợp. Hãy thử thay đổi bộ lọc.</p>
                </div>
            )}
            {hasNext && (
                <div className="load-more-container">
                    <button className="btn-load-more" onClick={onLoadMore} disabled={loading}>
                        {loading ? "Đang tải..." : "Khám phá thêm"}
                    </button>
                </div>
            )}
        </section>
    );
};

// ============================================
// Main TutorSearchPage Component
// ============================================
const TutorSearchPage = () => {
    // Centralized search state
    const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
    const [inputSearchTerm, setInputSearchTerm] = useState(""); // controlled input, separate from committed filter

    // Results state
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);

    // Track if we are loading more (append) vs new search (replace)
    const isLoadMore = useRef(false);

    // Build API params from filters
    // NOTE: Backend only supports single `category` and `gradeLevel` values.
    // For multi-select, we fetch all results and filter client-side.
    const buildApiParams = useCallback((f: SearchFilters): TutorSearchParams => {
        const params: TutorSearchParams = {
            pageNumber: f.pageNumber,
            pageSize: f.pageSize,
            sortBy: f.sortBy,
        };

        if (f.searchTerm.trim()) {
            params.searchTerm = f.searchTerm.trim();
        }
        // Only send single category to API (backend limitation)
        if (f.categories.length === 1) {
            params.category = f.categories[0];
        }
        // Only send single gradeLevel to API (backend limitation)
        if (f.gradeLevels.length === 1) {
            params.gradeLevel = f.gradeLevels[0];
        }
        if (f.budgetRange && f.budgetRange !== "all") {
            params.budgetRange = f.budgetRange;
        }
        if (f.teachingMode) {
            params.teachingMode = f.teachingMode;
        }
        if (f.city) {
            params.teachingAreaCity = f.city;
        }

        return params;
    }, []);

    // Map category IDs → subject names for client-side filtering
    const categoryNameMap: Record<string, string> = {
        math: 'Toán Học',
        physics: 'Vật Lý',
        chemistry: 'Hóa Học',
        english: 'Tiếng Anh',
        science: 'Khoa Học',
        language: 'Ngoại Ngữ',
        art: 'Nghệ Thuật',
        it_tech: 'Công Nghệ',
    };

    // Client-side filter for multi-select (when backend can't handle it)
    const applyClientSideFilters = useCallback((tutorsList: Tutor[], f: SearchFilters): Tutor[] => {
        let filtered = tutorsList;

        // Filter by categories (AND logic — tutor must teach ALL selected subjects)
        if (f.categories.length > 1) {
            const selectedNames = f.categories.map(id => categoryNameMap[id]).filter(Boolean);
            filtered = filtered.filter(tutor =>
                selectedNames.every(name => tutor.subjects.includes(name))
            );
        }

        // Filter by grade levels (AND logic — tutor must cover ALL selected grades)
        if (f.gradeLevels.length > 1) {
            const selectedGradeLabels = f.gradeLevels.map(gl => {
                const match = gl.match(/^Grade_(\d+)$/i);
                return match ? `Lớp ${match[1]}` : gl;
            });
            filtered = filtered.filter(tutor =>
                selectedGradeLabels.every(gl => tutor.gradeLevels.includes(gl))
            );
        }

        return filtered;
    }, []);

    // Fetch tutors whenever filters change
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiParams = buildApiParams(filters);
                console.log("📡 API call with params:", apiParams);
                const response = await searchTutors(apiParams);
                let mapped = response.content.items.map(mapApiTutorToUi);

                // Apply client-side filtering for multi-select
                mapped = applyClientSideFilters(mapped, filters);

                if (isLoadMore.current) {
                    // Append new results for "Load More"
                    setTutors((prev) => [...prev, ...mapped]);
                    isLoadMore.current = false;
                } else {
                    // Replace results for new search / filter change
                    setTutors(mapped);
                }

                // Update count — use filtered count for multi-select
                const needsClientFilter = filters.categories.length > 1 || filters.gradeLevels.length > 1;
                setTotalCount(needsClientFilter ? mapped.length : response.content.totalCount);
                setHasNext(needsClientFilter ? false : response.content.hasNext);
            } catch (err) {
                console.error("Failed to fetch tutors:", err);
                setError("Không thể tải danh sách gia sư. Vui lòng thử lại.");
                if (!isLoadMore.current) {
                    setTutors([]);
                    setTotalCount(0);
                }
                isLoadMore.current = false;
            } finally {
                setLoading(false);
            }
        };

        fetchTutors();
    }, [filters, buildApiParams, applyClientSideFilters]);

    // ---- Handler: update a single filter and reset to page 1 ----
    const updateFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            pageNumber: 1, // reset to page 1 on any filter change
        }));
    }, []);

    // ---- Search handlers ----
    const handleSearchSubmit = useCallback(() => {
        updateFilter("searchTerm", inputSearchTerm);
    }, [inputSearchTerm, updateFilter]);

    const handleTrendingClick = useCallback((tag: string) => {
        setInputSearchTerm(tag);
        updateFilter("searchTerm", tag);
    }, [updateFilter]);

    // ---- Category handler (multi-select toggle) ----
    const handleCategoryToggle = useCallback((category: string) => {
        if (category === 'all') {
            // "Tất cả" clears all selections
            updateFilter("categories", []);
        } else {
            setFilters(prev => {
                const current = prev.categories;
                const next = current.includes(category)
                    ? current.filter(c => c !== category)
                    : [...current, category];
                return { ...prev, categories: next, pageNumber: 1 };
            });
        }
    }, [updateFilter]);

    // ---- Grade level handler (multi-select toggle) ----
    const handleGradeLevelToggle = useCallback((value: string) => {
        if (value === 'all') {
            // "Tất cả" clears all selections
            updateFilter("gradeLevels", []);
        } else {
            setFilters(prev => {
                const current = prev.gradeLevels;
                const next = current.includes(value)
                    ? current.filter(g => g !== value)
                    : [...current, value];
                return { ...prev, gradeLevels: next, pageNumber: 1 };
            });
        }
    }, [updateFilter]);

    // ---- Filter handlers ----
    const handleBudgetRangeChange = useCallback((value: string) => {
        updateFilter("budgetRange", value);
    }, [updateFilter]);

    const handleTeachingModeChange = useCallback((value: string) => {
        updateFilter("teachingMode", value);
    }, [updateFilter]);

    const handleSortByChange = useCallback((value: string) => {
        updateFilter("sortBy", value);
    }, [updateFilter]);

    const handleCityChange = useCallback((value: string) => {
        updateFilter("city", value);
    }, [updateFilter]);

    const handleResetFilters = useCallback(() => {
        setInputSearchTerm("");
        setFilters({ ...defaultFilters });
    }, []);

    // ---- Load More handler ----
    const handleLoadMore = useCallback(() => {
        isLoadMore.current = true;
        setFilters((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1,
        }));
    }, []);

    return (
        <div className="tutor-search-page">
            <Header />
            <main>
                <SearchHero
                    searchTerm={inputSearchTerm}
                    onSearchTermChange={setInputSearchTerm}
                    onSearch={handleSearchSubmit}
                    onTrendingClick={handleTrendingClick}
                />
                <CategoryTabs
                    activeCategories={filters.categories}
                    onCategoryToggle={handleCategoryToggle}
                />
                <FilterBar
                    gradeLevels={filters.gradeLevels}
                    budgetRange={filters.budgetRange}
                    teachingMode={filters.teachingMode}
                    city={filters.city}
                    sortBy={filters.sortBy}
                    onGradeLevelToggle={handleGradeLevelToggle}
                    onBudgetRangeChange={handleBudgetRangeChange}
                    onTeachingModeChange={handleTeachingModeChange}
                    onCityChange={handleCityChange}
                    onSortByChange={handleSortByChange}
                    onResetFilters={handleResetFilters}
                />
                <ActiveFilters
                    categories={filters.categories}
                    gradeLevels={filters.gradeLevels}
                    onRemoveCategory={(cat) => handleCategoryToggle(cat)}
                    onRemoveGradeLevel={(gl) => handleGradeLevelToggle(gl)}
                    onClearAll={() => {
                        setFilters(prev => ({ ...prev, categories: [], gradeLevels: [], pageNumber: 1 }));
                    }}
                />
                <ResultsSection
                    tutors={tutors}
                    loading={loading}
                    error={error}
                    totalCount={totalCount}
                    hasNext={hasNext}
                    onLoadMore={handleLoadMore}
                />
            </main>
            <Footer />
        </div>
    );
};

export default TutorSearchPage;
