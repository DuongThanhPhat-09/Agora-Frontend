import styles from './styles.module.css';
import ChildCard from './components/ChildCard';
import RecentlyLinkedCard from './components/RecentlyLinkedCard';

// Image assets from Figma
const imgAvatarEmma = 'https://www.figma.com/api/mcp/asset/0fa7b0e1-9fe5-4e49-b384-5a30d16ca000';
const imgAvatarAlex = 'https://www.figma.com/api/mcp/asset/ea9649f1-06e8-41ab-8ef5-e7606621e01c';
const imgIconTips = 'https://www.figma.com/api/mcp/asset/1c486814-8b98-4211-ad3c-de384f3ab1e0';
const imgIconCheck = 'https://www.figma.com/api/mcp/asset/672780ca-4804-4e4b-8cc3-16f3d6b5a3a5';

// Sample data for children
const childrenData = [
    {
        name: 'Emma Chen',
        grade: 'Grade 8',
        status: 'linked' as const,
        avatar: imgAvatarEmma,
        nextLesson: 'Today 4:00 PM',
        primaryTutor: 'Sarah Mitchell',
        attendance: '4/5 this week',
        homework: '1 pending',
    },
    {
        name: 'Alex Chen',
        grade: 'Grade 10',
        status: 'linked' as const,
        avatar: imgAvatarAlex,
        nextLesson: 'Tomorrow 2:00 PM',
        activeClasses: '2 tutors',
        attendance: '5/5 this week',
        homework: 'All complete',
        dashboardVariant: 'muted' as const,
    },
    {
        name: 'Sophie Chen',
        grade: 'Grade 6',
        status: 'pending' as const,
        inviteDate: 'Invite sent on Jan 15, 2025',
        inviteMessage: 'Waiting for child to accept invitation',
    },
];

// Sample data for recently linked
const recentlyLinkedData = [
    {
        name: 'Emma Chen',
        avatar: '',
        linkedDate: 'Linked on Jan 18, 2025',
        timeAgo: '3 days ago',
    },
    {
        name: 'Alex Chen',
        avatar: '',
        linkedDate: 'Linked on Jan 10, 2025',
        timeAgo: '11 days ago',
    },
];

const ParentChildren = () => {
    return (
        <div className={styles.mainContent} data-name="Main - Scrollable Content" data-node-id="2253:12680">
            <div className={styles.container} data-name="Container" data-node-id="2253:12681">
                {/* Left Column - Children Cards */}
                <div className={styles.leftColumn} data-name="Left Column - Children Cards" data-node-id="2253:12682">
                    {/* My Children Heading */}
                    <div className={styles.heading} data-name="Heading 2" data-node-id="2253:12683">
                        <p className={styles.headingText}>My Children</p>
                    </div>

                    {/* Children Cards Container */}
                    <div className={styles.childrenContainer} data-name="Container" data-node-id="2253:12685">
                        {/* Child Card 1 - Emma */}
                        <ChildCard child={childrenData[0]} data-name="Child Card 1" data-node-id="2253:12686" />

                        {/* Child Card 2 - Alex */}
                        <ChildCard child={childrenData[1]} data-name="Child Card 2" data-node-id="2253:12752" />

                        {/* Child Card 3 - Sophie (Pending) */}
                        <ChildCard child={childrenData[2]} data-name="Child Card 3 - Pending" data-node-id="2253:12818" />
                    </div>

                    {/* Recently Linked Section */}
                    <div className={styles.recentlyLinkedSection} data-name="Recently Linked Section" data-node-id="2253:12853">
                        <div className={styles.subheading} data-name="Heading 3" data-node-id="2253:12854">
                            <p className={styles.subheadingText}>Recently Linked</p>
                        </div>
                        <RecentlyLinkedCard items={recentlyLinkedData} data-name="Background+Border" data-node-id="2253:12856" />
                    </div>
                </div>

                {/* Right Column - Tips & Pending */}
                <div className={styles.rightColumn} data-name="Right Column - Tips & Pending" data-node-id="2253:12921">
                    {/* Linking Tips Card */}
                    <div className={styles.sidebarCard} data-name="Background+Border" data-node-id="2253:12922">
                        <div className={styles.sidebarCardHeader} data-name="Container" data-node-id="2253:12923">
                            <img src={imgIconTips} alt="" className={styles.sidebarCardIcon} />
                            <p className={styles.sidebarCardTitle} data-name="Heading 3:margin" data-node-id="2253:12927">Linking Tips</p>
                        </div>
                        <div className={styles.tipsList} data-name="List" data-node-id="2253:12929">
                            <div className={styles.tipItem} data-name="Item" data-node-id="2253:12930">
                                <div className={styles.tipIcon} data-name="Margin" data-node-id="2253:12931">
                                    <img src={imgIconCheck} alt="" className={styles.iconCheck} />
                                </div>
                                <p className={styles.tipText} data-name="Margin" data-node-id="2253:12934">Share invite link via Zalo for instant delivery</p>
                            </div>
                            <div className={styles.tipItem} data-name="Item" data-node-id="2253:12936">
                                <div className={styles.tipIcon} data-name="Margin" data-node-id="2253:12937">
                                    <img src={imgIconCheck} alt="" className={styles.iconCheck} />
                                </div>
                                <p className={styles.tipTextSingle} data-name="Margin" data-node-id="2253:12940">Use QR code for in-person linking</p>
                            </div>
                            <div className={styles.tipItem} data-name="Item" data-node-id="2253:12942">
                                <div className={styles.tipIcon} data-name="Margin" data-node-id="2253:12943">
                                    <img src={imgIconCheck} alt="" className={styles.iconCheck} />
                                </div>
                                <p className={styles.tipTextSingle} data-name="Margin" data-node-id="2253:12946">Invites expire after 7 days</p>
                            </div>
                            <div className={styles.tipItem} data-name="Item" data-node-id="2253:12948">
                                <div className={styles.tipIcon} data-name="Margin" data-node-id="2253:12949">
                                    <img src={imgIconCheck} alt="" className={styles.iconCheck} />
                                </div>
                                <p className={styles.tipTextSingle} data-name="Margin" data-node-id="2253:12952">You can link multiple children</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Invites Card */}
                    <div className={styles.sidebarCard} data-name="Background+Border" data-node-id="2253:12954">
                        <div className={styles.sidebarSubheading} data-name="Heading 3" data-node-id="2253:12955">
                            <p className={styles.sidebarSubheadingText}>Pending Invites</p>
                        </div>
                        <div className={styles.pendingInviteItem} data-name="Container" data-node-id="2253:12957">
                            <div className={styles.pendingInviteLeft} data-name="Container" data-node-id="2253:12958">
                                <p className={styles.pendingInviteName} data-name="Container" data-node-id="2253:12960">Sophie Chen</p>
                                <p className={styles.pendingInviteDate} data-name="Container" data-node-id="2253:12962">Sent 6 days ago</p>
                            </div>
                            <button className={styles.pendingInviteButton} data-name="Button" data-node-id="2253:12963">
                                <p className={styles.pendingInviteButtonText}>Resend</p>
                            </button>
                        </div>
                        <div className={styles.pendingInviteDivider} data-name="HorizontalBorder" data-node-id="2253:12965">
                            <p className={styles.pendingInviteNote}>Pending invites will expire in 1 day</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentChildren;
