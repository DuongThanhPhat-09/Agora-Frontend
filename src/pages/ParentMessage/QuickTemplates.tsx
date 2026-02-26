import styles from './styles.module.css';

const QuickTemplates = () => {
    return (
        <div className={styles.quickTemplates}>
            <span className={styles.quickTemplatesLabel}>Quick Templates</span>
            <div className={styles.quickTemplateRow}>
                <button className={styles.templateButton} type="button">
                    Thank you for the update
                </button>
                <button className={styles.templateButton} type="button">
                    How is Emma&apos;s progress?
                </button>
                <button className={styles.templateButton} type="button">
                    Request homework help
                </button>
            </div>
        </div>
    );
};

export default QuickTemplates;
