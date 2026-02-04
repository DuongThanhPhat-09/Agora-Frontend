import styles from './styles.module.css';
import MessageInfoItem from './MessageInfoItem';
import MessageSearch from './MessageSearch';

const tutorAvatar = 'https://www.figma.com/api/mcp/asset/3ee4e6d4-e39b-4753-a0d0-0ec3d0ba2b44';
const tutorAvatarAlt = 'https://www.figma.com/api/mcp/asset/2b41246a-16ac-434f-902c-169a0a6d53f0';
const childAvatar = 'https://www.figma.com/api/mcp/asset/26858887-648e-4775-ba0a-abeeca57f3ac';
const teacherAvatar = 'https://www.figma.com/api/mcp/asset/c45f626e-4803-44ac-b338-b021f830966e';
const badgeAssigned = 'https://www.figma.com/api/mcp/asset/d7adf34e-7b26-4007-8282-2540aba0e56e';
const badgeNoHomework = 'https://www.figma.com/api/mcp/asset/3d65b791-f110-4ee5-b01a-be943e5568fe';

const MessageListSidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <MessageSearch />
            <div className={styles.messageList}>
                <MessageInfoItem
                    active
                    avatar={tutorAvatar}
                    badge={{ label: 'HW Assigned', icon: badgeAssigned }}
                    name="Sarah Mitchell"
                    preview="Emma did great today! We covered …"
                    role="Math Tutor"
                    session="Session #12"
                    timestamp="2:30 PM"
                    unread
                />
                <MessageInfoItem
                    avatar={tutorAvatarAlt}
                    badge={{ label: 'No HW', icon: badgeNoHomework, muted: true }}
                    name="Mr. Davis"
                    preview="Thank you for the update. I'll prepar…"
                    role="Physics Tutor"
                    session="Session #8"
                    timestamp="Yesterday"
                />
                <MessageInfoItem
                    avatar={childAvatar}
                    name="Emma Chen"
                    preview="Mom, I finished my math homework…"
                    role="Your Child"
                    session=""
                    timestamp="Jan 18"
                />
                <MessageInfoItem
                    avatar={teacherAvatar}
                    badge={{ label: 'HW Assigned', icon: badgeAssigned }}
                    name="Ms. Johnson"
                    preview="Emma's essay was excellent. She's…"
                    role="English Tutor"
                    session="Session #5"
                    timestamp="Jan 15"
                />
            </div>
        </aside>
    );
};

export default MessageListSidebar;
