import type { StepProps } from "./types";
import { TEACHING_MODES } from "./constants";

const StepTeachingMode: React.FC<StepProps> = ({ formData, setFormData }) => {
    const needsLocation = formData.teachingMode === "offline" || formData.teachingMode === "hybrid";

    return (
        <div className="bm-step">
            <div className="bm-step-title">Hình thức học</div>
            <div className="bm-teaching-mode-grid">
                {TEACHING_MODES.map((mode) => (
                    <div
                        key={mode.key}
                        className={`bm-teaching-mode-card ${formData.teachingMode === mode.key ? "selected" : ""}`}
                        onClick={() => setFormData((d) => ({
                            ...d,
                            teachingMode: mode.key,
                            ...(mode.key === "online" ? { locationCity: "", locationDistrict: "", locationWard: "", locationDetail: "" } : {})
                        }))}
                    >
                        <div className="bm-teaching-mode-icon">{mode.icon}</div>
                        <div className="bm-teaching-mode-info">
                            <span className="bm-teaching-mode-label">{mode.label}</span>
                            <span className="bm-teaching-mode-desc">{mode.desc}</span>
                        </div>
                        {formData.teachingMode === mode.key && <div className="bm-check">✓</div>}
                    </div>
                ))}
            </div>

            {needsLocation && (
                <div className="bm-location-section">
                    <div className="bm-step-title" style={{ marginTop: 28 }}>
                        Địa điểm học
                        <span className="bm-required-badge">Bắt buộc</span>
                    </div>
                    <div className="bm-location-form">
                        <div className="bm-form-row">
                            <div className="bm-form-group">
                                <label className="bm-form-label">Tỉnh / Thành phố *</label>
                                <input
                                    type="text"
                                    className="bm-form-input"
                                    placeholder="VD: Hồ Chí Minh"
                                    value={formData.locationCity}
                                    onChange={(e) => setFormData((d) => ({ ...d, locationCity: e.target.value }))}
                                />
                            </div>
                            <div className="bm-form-group">
                                <label className="bm-form-label">Quận / Huyện *</label>
                                <input
                                    type="text"
                                    className="bm-form-input"
                                    placeholder="VD: Quận 1"
                                    value={formData.locationDistrict}
                                    onChange={(e) => setFormData((d) => ({ ...d, locationDistrict: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="bm-form-row">
                            <div className="bm-form-group">
                                <label className="bm-form-label">Phường / Xã</label>
                                <input
                                    type="text"
                                    className="bm-form-input"
                                    placeholder="VD: Phường Bến Nghé"
                                    value={formData.locationWard}
                                    onChange={(e) => setFormData((d) => ({ ...d, locationWard: e.target.value }))}
                                />
                            </div>
                            <div className="bm-form-group">
                                <label className="bm-form-label">Địa chỉ cụ thể</label>
                                <input
                                    type="text"
                                    className="bm-form-input"
                                    placeholder="VD: 123 Nguyễn Huệ"
                                    value={formData.locationDetail}
                                    onChange={(e) => setFormData((d) => ({ ...d, locationDetail: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepTeachingMode;
