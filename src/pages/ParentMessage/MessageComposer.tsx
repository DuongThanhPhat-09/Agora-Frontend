import styles from './styles.module.css';

const attachIcon = 'https://www.figma.com/api/mcp/asset/9eb5351d-9a24-43a9-8521-a6e4ca4ace17';
const sendIcon = 'https://www.figma.com/api/mcp/asset/7ae15279-f08c-404b-8b6f-2f037e6f3f13';

const MessageComposer = () => {
    return (
        <div className={styles.composer}>
            <button className={styles.iconButton} type="button">
                <img alt="" src={attachIcon} />
            </button>
            <textarea className={styles.composerInput} placeholder="Type your message..." rows={1} />
            <button className={styles.sendButton} type="button">
                <img alt="" src={sendIcon} />
            </button>
        </div>
    );
};

export default MessageComposer;
