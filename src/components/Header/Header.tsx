import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-content">
                {/* Logo */}
                <Link to="/" className="logo-link">
                    <div className="logo-icon">
                        <span className="logo-letter">A</span>
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">AGORA</span>
                        <span className="logo-tagline">Academic Heritage</span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="main-nav">
                    <Link to="/tutor-search" className="nav-link">TÌM GIA SƯ</Link>
                    <a href="#learning-path" className="nav-link">LỘ TRÌNH HỌC</a>
                    <a href="#lms" className="nav-link">LMS ENGINE</a>
                    <a href="#about" className="nav-link">VỀ CHÚNG TÔI</a>
                </nav>

                {/* Auth Buttons */}
                <div className="auth-buttons">
                    <Link to="/login" className="btn-login">LOG IN</Link>
                    <button className="btn-signup">SIGN UP</button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <nav className="mobile-nav">
                        <Link to="/tutor-search" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>TÌM GIA SƯ</Link>
                        <a href="#learning-path" className="mobile-nav-link">LỘ TRÌNH HỌC</a>
                        <a href="#lms" className="mobile-nav-link">LMS ENGINE</a>
                        <a href="#about" className="mobile-nav-link">VỀ CHÚNG TÔI</a>
                    </nav>
                    <div className="mobile-auth">
                        <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>LOG IN</Link>
                        <button className="btn-signup">SIGN UP</button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
