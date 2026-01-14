import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/pages/tutor-detail.css";

// SVG Icons
const PlayIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.667 9.333L19.334 14L11.667 18.667V9.333Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
    <svg width="10.5" height="10.5" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.5 1L6.939 3.915L10 4.365L7.75 6.555L8.378 9.6L5.5 8.085L2.622 9.6L3.25 6.555L1 4.365L4.061 3.915L5.5 1Z"
            fill={filled ? "#D4B483" : "none"}
            stroke="#D4B483"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const HeartIcon = () => (
    <svg width="17.5" height="17.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.75 3.375C14.85 2.475 13.65 2.025 12.375 2.025C11.1 2.025 9.9 2.475 9 3.375L8.25 4.125L7.5 3.375C5.625 1.5 2.625 1.5 0.75 3.375C-1.125 5.25 -1.125 8.25 0.75 10.125L8.25 17.625L15.75 10.125C17.625 8.25 17.625 5.25 15.75 3.375Z" fill="white" />
    </svg>
);

const GraduationIcon = () => (
    <svg width="17.5" height="17.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1.5L1 5.5L9 9.5L17 5.5L9 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 5.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 7V12C4 13.5 6 15 9 15C12 15 14 13.5 14 12V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="8.8" height="8.8" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 2.25L3.5625 6.1875L1.5 4.125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CertificateIcon = () => (
    <svg width="17.5" height="17.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H4C2.9 2 2 2.9 2 4V14C2 15.1 2.9 16 4 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FileIcon = () => (
    <svg width="17.5" height="17.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1H4C3.4 1 3 1.4 3 2V16C3 16.6 3.4 17 4 17H14C14.6 17 15 16.6 15 16V6L10 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 1V6H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="10.5" height="10.5" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 1L2 2.5V5C2 7.5 3.5 9.5 5.5 10C7.5 9.5 9 7.5 9 5V2.5L5.5 1Z" stroke="#3D4A3E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const VerifyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L5.5 10.5L2 7" stroke="#3D4A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const QuoteIcon = () => (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="5" y="32" fontSize="36" fontFamily="Georgia, serif" fill="#E4DED5">"</text>
    </svg>
);

// Tutor Data
const tutorData = {
    name: "Dr. Sarah Jenkins",
    credential: "PhD Candidate in Molecular Biology",
    university: "Oxford University",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    interviewThumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    rating: 4.9,
    reviews: 127,
    tags: ["Sinh học phân tử", "IB Diploma", "A-Level", "Luyện thi Y khoa", "Cố vấn du học"],
    about: {
        intro: "Tôi chuyên sâu vào việc thu hẹp khoảng cách giữa chương trình trung học và kỳ vọng khắt khe của các đại học top đầu thế giới. Phương pháp của tôi tập trung vào việc học dựa trên vấn đề (Inquiry-based learning) và phân tích phê phán.",
        experience: "Trong 5 năm qua, tôi đã cố vấn cho hơn 120 học sinh, đa số đều chuyển tiếp thành công vào ngành Y khoa, Khoa học Sinh học và Khoa học Tự nhiên tại các định chế giáo dục danh tiếng. Tôi tin rằng thành công học thuật gồm 30% kiến thức và 70% tư duy chiến lược."
    },
    credentials: {
        education: { title: "Học vấn", institution: "Đại học Oxford", detail: "Tiến sĩ, Sinh học phân tử" },
        experience: { title: "Kinh nghiệm", institution: "Cố vấn Tuyển sinh Cao cấp", detail: "Chuyên sâu Oxbridge (3 năm)" },
        certificate: { title: "Chứng chỉ", institution: "Qualified Teacher (QTS)", detail: "Vương Quốc Anh" }
    },
    academicDegrees: [
        { title: "Tiến sĩ Sinh học Phân tử", institution: "University of Oxford", verified: true },
        { title: "Thạc sĩ Khoa học (Honors)", institution: "Imperial College London", verified: true }
    ],
    certificates: [
        { title: "Qualified Teacher Status", institution: "Department for Education UK", verified: true },
        { title: "IELTS Academic", institution: "Overall Band Score", score: "8.5", verified: true },
        { title: "GRE Biology Subject", institution: "98th Percentile", score: "980", verified: true },
        { title: "Higher Education Fellowship", institution: "Advance HE", verified: true }
    ],
    stats: [
        { value: "+1.8", label: "GPA trung bình tăng", sublabel: "Sau 12 tuần giảng dạy" },
        { value: "98%", label: "Học sinh đỗ nguyện vọng 1", sublabel: "Oxbridge & Ivy League" },
        { value: "+220", label: "Tăng điểm SAT/IELTS", sublabel: "Điểm SAT trung bình tăng" },
        { value: "12w", label: "Thời gian đạt mục tiêu", sublabel: "Lộ trình cá nhân hóa" }
    ],
    testimonials: [
        {
            id: 1,
            name: "Lê Minh Anh",
            initial: "L",
            role: "Học sinh Year 13 (A-Level)",
            quote: `"Chuyên môn của Sarah là không thể bàn cãi. Cô không chỉ dạy kiến thức mà còn dạy cách các giáo sư Oxford tư duy khi ra đề thi."`,
            duration: "6 tháng",
            goal: "Thi đỗ Y khoa - University of Cambridge",
            result: "Đạt A* Biology, đỗ nguyện vọng 1"
        },
        {
            id: 2,
            name: "Chị Tuyết Mai",
            initial: "C",
            role: "Phụ huynh tại Hà Nội",
            quote: `"Sự minh bạch trong báo cáo định kỳ là điều tôi hài lòng nhất. Tôi biết con mình tiến bộ từng ngày thông qua Agora LMS."`,
            duration: "4 tháng",
            goal: "Cải thiện IB Biology từ 4 lên 7",
            result: "Kết quả cuối kỳ đạt điểm 7 tuyệt đối"
        }
    ],
    price: "500.000đ",
    schedule: [
        { day: "T2", date: "21" },
        { day: "T3", date: "22" },
        { day: "T4", date: "23" },
        { day: "T5", date: "24", selected: true },
        { day: "T6", date: "25" }
    ],
    timeSlots: [
        { time: "09:00", disabled: true },
        { time: "10:30", selected: true },
        { time: "13:30", available: true },
        { time: "15:00", disabled: true },
        { time: "16:30", available: true },
        { time: "19:00", available: true }
    ]
};

// Hero Section with Video Thumbnail
const HeroSection = () => (
    <section className="tutor-hero-section">
        <div className="component-2">
            <img
                className="interview-thumbnail"
                src={tutorData.interviewThumbnail}
                alt="Sarah Jenkins Academic Interview"
            />
            <div className="gradient-overlay"></div>

            {/* Play Button */}
            <div className="play-button-container">
                <div className="play-button">
                    <PlayIcon />
                </div>
                <b className="click-to-view">Click to View Academic Interview</b>
            </div>

            {/* Agora Badge */}
            <div className="agora-badge-container">
                <div className="agora-badge">
                    <div className="agora-badge-dot"></div>
                    <b className="agora-badge-text">Agora Original Interview</b>
                </div>
            </div>

            {/* Tutor Info Card */}
            <div className="tutor-info-card">
                <div className="tutor-info-content">
                    <div className="tutor-mini-avatar">
                        <img src={tutorData.avatar} alt={tutorData.name} />
                        <div className="mini-avatar-gradient"></div>
                    </div>
                    <div className="tutor-info-text">
                        <div className="university-badge">
                            <b>{tutorData.university}</b>
                        </div>
                        <h1 className="tutor-name">{tutorData.name}</h1>
                        <p className="tutor-credential">{tutorData.credential}</p>
                    </div>
                </div>
            </div>

            {/* Rating Card */}
            <div className="rating-card-container">
                <div className="rating-card">
                    <div className="rating-stars">
                        <div className="stars-row">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <StarIcon key={i} filled={true} />
                            ))}
                        </div>
                        <b className="rating-text">{tutorData.rating} ({tutorData.reviews} REVIEWS)</b>
                    </div>
                    <div className="rating-divider"></div>
                    <div className="favorite-button">
                        <HeartIcon />
                    </div>
                </div>
            </div>
        </div>

        {/* Subject Tags */}
        <div className="subject-tags">
            {tutorData.tags.map((tag, index) => (
                <div key={index} className="subject-tag">
                    <b>{tag}</b>
                </div>
            ))}
        </div>
    </section>
);

// About Section
const AboutSection = () => (
    <section className="about-section">
        <h2 className="section-title">Về Mentor Sarah</h2>
        <div className="about-content">
            <div className="about-text">
                <p className="about-intro">{tutorData.about.intro}</p>
                <p className="about-experience">{tutorData.about.experience}</p>
            </div>
            <div className="credentials-card">
                <div className="credential-item">
                    <span className="credential-label">{tutorData.credentials.education.title}</span>
                    <b className="credential-institution">{tutorData.credentials.education.institution}</b>
                    <i className="credential-detail">{tutorData.credentials.education.detail}</i>
                </div>
                <div className="credential-item">
                    <span className="credential-label">{tutorData.credentials.experience.title}</span>
                    <b className="credential-institution">{tutorData.credentials.experience.institution}</b>
                    <i className="credential-detail">{tutorData.credentials.experience.detail}</i>
                </div>
                <div className="credential-item">
                    <span className="credential-label">{tutorData.credentials.certificate.title}</span>
                    <b className="credential-institution">{tutorData.credentials.certificate.institution}</b>
                    <i className="credential-detail">{tutorData.credentials.certificate.detail}</i>
                </div>
            </div>
        </div>
    </section>
);

// Academic Portfolio Section
const AcademicPortfolioSection = () => (
    <section className="portfolio-section">
        <div className="portfolio-header">
            <div className="portfolio-title-group">
                <h2 className="section-title">Hồ sơ năng lực học thuật</h2>
                <span className="portfolio-subtitle">Hệ thống Agora Academic Ledger v2.4</span>
            </div>
            <div className="verified-badge-green">
                <b>Xác thực 100%</b>
            </div>
        </div>

        <div className="portfolio-content">
            {/* Academic Degrees */}
            <div className="portfolio-category">
                <div className="category-header">
                    <div className="category-indicator navy"></div>
                    <span className="category-title">I. Văn bằng học thuật</span>
                    <div className="category-divider"></div>
                </div>
                <div className="degrees-grid">
                    {tutorData.academicDegrees.map((degree, index) => (
                        <div key={index} className="degree-card">
                            <div className="degree-icon navy">
                                <GraduationIcon />
                            </div>
                            <div className="degree-info">
                                <div className="degree-title-row">
                                    <b className="degree-title">{degree.title}</b>
                                    {degree.verified && (
                                        <div className="verified-check">
                                            <CheckIcon />
                                        </div>
                                    )}
                                </div>
                                <span className="degree-institution">{degree.institution}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certificates */}
            <div className="portfolio-category">
                <div className="category-header">
                    <div className="category-indicator gold"></div>
                    <span className="category-title">II. Chứng chỉ & Khảo thí</span>
                    <div className="category-divider"></div>
                    <button className="view-more-btn">XEM THÊM</button>
                </div>
                <div className="certificates-grid">
                    {tutorData.certificates.map((cert, index) => (
                        <div key={index} className="certificate-card">
                            <div className="certificate-icon">
                                {cert.score ? <FileIcon /> : <CertificateIcon />}
                            </div>
                            <div className="certificate-info">
                                <div className="certificate-title-row">
                                    <b className="certificate-title">{cert.title}</b>
                                    {cert.verified && (
                                        <div className="verified-check">
                                            <CheckIcon />
                                        </div>
                                    )}
                                </div>
                                <span className="certificate-institution">{cert.institution}</span>
                                {cert.score && <b className="certificate-score">{cert.score}</b>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Portfolio Footer */}
            <div className="portfolio-footer">
                <div className="portfolio-note">
                    <div className="note-dot green"></div>
                    <b>Hồ sơ gốc lưu trữ bởi Agora</b>
                </div>
                <div className="portfolio-note">
                    <div className="note-dot green"></div>
                    <b>Đã kiểm tra chéo (Cross-checked)</b>
                </div>
            </div>
        </div>
    </section>
);

// Stats Section
const StatsSection = () => (
    <section className="stats-section">
        <div className="stats-header">
            <h2 className="section-title">Hiệu quả đào tạo thực tế</h2>
            <div className="stats-badge">
                <ShieldIcon />
                <b>Dữ liệu xác thực từ Agora LMS</b>
            </div>
        </div>
        <div className="stats-grid">
            {tutorData.stats.map((stat, index) => (
                <div key={index} className="stat-card">
                    <b className="stat-value">{stat.value}</b>
                    <b className="stat-label">{stat.label}</b>
                    <i className="stat-sublabel">{stat.sublabel}</i>
                </div>
            ))}
        </div>
    </section>
);

// Testimonials Section
const TestimonialsSection = () => (
    <section className="section5">
        <div className="heading-24">
            <h2 className="nht-k-thnh">Nhật ký thành công</h2>
        </div>
        <div className="container84">
            {tutorData.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="component-8">
                    {/* Quote Icon - positioned at top-right of card */}
                    <div className="container85">
                        <div className="component-122">
                            <QuoteIcon />
                        </div>
                    </div>
                    <div className="container86">
                        <div className="container87">
                            {/* User Info */}
                            <div className="container88">
                                <div className="background7">
                                    <b className="l">{testimonial.initial}</b>
                                </div>
                                <div className="container89">
                                    <div className="heading-47">
                                        <b className="l-minh-anh">{testimonial.name}</b>
                                    </div>
                                    <div className="container90">
                                        <span className="hc-sinh-year">{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Quote */}
                            <div className="container91">
                                <i className="chuyn-mn-ca">{testimonial.quote}</i>
                            </div>
                            {/* Badges */}
                            <div className="container92">
                                <div className="border2">
                                    <b className="xc-thc-bi">Xác thực bởi Agora LMS</b>
                                </div>
                                <div className="border2">
                                    <b className="xc-thc-bi">Học trong {testimonial.duration}</b>
                                </div>
                            </div>
                        </div>
                        {/* Result Card */}
                        <div className="background8">
                            <div className="container93">
                                <span className="mc-tiu-ban">Mục tiêu ban đầu</span>
                                <div className="container95">
                                    <b className="thi-y">{testimonial.goal}</b>
                                </div>
                            </div>
                            <div className="horizontal-divider3"></div>
                            <div className="container96">
                                <span className="mc-tiu-ban">Kết quả thực tế</span>
                                <div className="container98">
                                    <b className="t-a-biology">{testimonial.result}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <button className="component-9">
            <b className="xem-tt-c">Xem tất cả lộ trình thành công (124)</b>
        </button>
    </section>
);


// Booking Sidebar
const BookingSidebar = () => (
    <aside className="booking-sidebar">
        <div className="booking-card">
            {/* Price Header */}
            <div className="booking-header">
                <span className="booking-label">Bắt đầu lộ trình học thuật</span>
                <div className="price-display">
                    <b className="price-amount">{tutorData.price}</b>
                    <b className="price-unit">/ BUỔI HỌC</b>
                </div>
            </div>

            {/* Date Picker */}
            <div className="date-picker">
                <div className="date-grid">
                    {tutorData.schedule.map((day, index) => (
                        <div key={index} className={`date-item ${day.selected ? 'selected' : ''}`}>
                            <span className="day-label">{day.day}</span>
                            <b className="date-number">{day.date}</b>
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Picker */}
            <div className="time-picker-section">
                <span className="picker-label">TIME PICKER</span>
                <div className="time-grid">
                    {tutorData.timeSlots.map((slot, index) => (
                        <button
                            key={index}
                            className={`time-slot ${slot.selected ? 'selected' : ''} ${slot.disabled ? 'disabled' : ''}`}
                            disabled={slot.disabled}
                        >
                            <b>{slot.time}</b>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="booking-actions">
                <button className="btn-start">
                    <b>BẮT ĐẦU NGAY</b>
                </button>
                <button className="btn-chat">
                    <b>CHAT TƯ VẤN</b>
                </button>
            </div>
        </div>

        {/* Verification Note */}
        <div className="verification-note">
            <div className="note-header">
                <VerifyIcon />
                <b>Đã xác minh bởi Agora Council</b>
            </div>
            <i className="note-text">Hoàn học phí nếu không hài lòng sau buổi học đầu tiên.</i>
        </div>
    </aside>
);

// Main TutorDetailPage Component
const TutorDetailPage = () => {
    return (
        <div className="tutor-detail-page">
            <Header />
            <main className="tutor-detail-main">
                <div className="tutor-detail-container">
                    <div className="tutor-detail-content">
                        <HeroSection />
                        <AboutSection />
                        <div className="portfolio-stats-wrapper">
                            <AcademicPortfolioSection />
                            <StatsSection />
                        </div>
                        <TestimonialsSection />
                    </div>
                    <BookingSidebar />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TutorDetailPage;
