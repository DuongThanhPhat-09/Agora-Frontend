import type { Dayjs } from "dayjs";
import styles from "../../../styles/pages/tutor-portal-schedule.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import type { ActiveTab } from "./types";

interface Props {
    currentDate: Dayjs;
    activeTab: ActiveTab;
    isCurrentPeriod: boolean;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    onTabChange: (tab: ActiveTab) => void;
}

const MobileHeader: React.FC<Props> = ({
    currentDate,
    activeTab,
    isCurrentPeriod,
    onPrev,
    onNext,
    onToday,
    onTabChange,
}) => {
    return (
        <div className={styles.mobileGcalHeader}>
            <button className={styles.mobileMonthBtn} onClick={onPrev}>
                <ChevronLeftIcon />
            </button>
            <span className={styles.mobileMonthLabel}>{`Tháng ${currentDate.format("M")}`}</span>
            <button className={styles.mobileMonthBtn} onClick={onNext}>
                <ChevronRightIcon />
            </button>
            <button
                className={`${styles.mobileTodayBtn} ${isCurrentPeriod ? styles.disabled : ""}`}
                onClick={onToday}
                disabled={isCurrentPeriod}
            >
                Hôm nay
            </button>
            <div className={styles.mobileTabSwitch}>
                <button
                    className={`${styles.mobileTabBtn} ${activeTab === "settings" ? styles.active : ""}`}
                    onClick={() => onTabChange("settings")}
                >
                    ⚙
                </button>
                <button
                    className={`${styles.mobileTabBtn} ${activeTab === "lessons" ? styles.active : ""}`}
                    onClick={() => onTabChange("lessons")}
                >
                    📅
                </button>
            </div>
        </div>
    );
};

export default MobileHeader;
