import styles from './styles.module.css';

// Image assets from Figma
const imgSvg12 = 'https://www.figma.com/api/mcp/asset/05d7f141-a0a3-4c3b-a5f2-8079c7b33f1d';
const imgSvg13 = 'https://www.figma.com/api/mcp/asset/33dd02de-4315-49a4-ab84-31afaa81d7b1';
const imgSvg14 = 'https://www.figma.com/api/mcp/asset/60dd6641-1fc7-4b3c-afee-50adc095749a';
const imgSvg15 = 'https://www.figma.com/api/mcp/asset/27bfb24c-ecc2-48d1-a6b6-44d5dd5470aa';
const imgSvg16 = 'https://www.figma.com/api/mcp/asset/3e726414-3d0d-41a3-a88b-e3710f265b2a';
const imgSvg17 = 'https://www.figma.com/api/mcp/asset/cbe6a9d6-2497-4558-9506-ac5dc26ba7c1';
const imgSvg18 = 'https://www.figma.com/api/mcp/asset/5375a5a4-5ab3-4fd3-8df7-085c3036be15';
const imgSvg19 = 'https://www.figma.com/api/mcp/asset/f7a76425-99ef-4617-ae09-f6807b2634ae';
const imgSvg20 = 'https://www.figma.com/api/mcp/asset/a15fb932-3ac2-4042-a4dc-56b3eae1379b';
const imgSvg21 = 'https://www.figma.com/api/mcp/asset/ce690e2e-228e-4bc3-9a39-17b5ee34a30a';
const imgSvg22 = 'https://www.figma.com/api/mcp/asset/1d2fea23-fbe0-4536-9730-d05ffa2d0322';
const imgSvg23 = 'https://www.figma.com/api/mcp/asset/31125374-59d8-457d-b358-bd873c98eb78';

const ParentDashboard = () => {
    return (
        <div className={styles.mainContent} data-name="Main - Scrollable Content" data-node-id="2253:12419">
            <div className={styles.container} data-name="Container" data-node-id="2253:12420">
                {/* Hero Card */}
                <div className={styles.heroCard} data-name="Hero Card" data-node-id="2253:12421">
                    <div className={styles.heroCardHeading} data-name="Heading 2" data-node-id="2253:12422">
                        <h2>Peace of Mind</h2>
                    </div>
                    <div className={styles.statsContainer} data-name="Container" data-node-id="2253:12424">
                        {/* Attendance Stats */}
                        <div className={styles.attendanceStats} data-name="Container" data-node-id="2253:12425">
                            <div className={styles.attendanceCircle} data-name="Background" data-node-id="2253:12427">
                                <span className={styles.attendanceValue} data-node-id="2253:12430">4/5</span>
                                <span className={styles.attendanceLabel} data-node-id="2253:12432">This Week</span>
                            </div>
                            <div className={styles.attendanceDetails} data-name="Container" data-node-id="2253:12433">
                                <div className={styles.attendanceTitle} data-name="Container" data-node-id="2253:12434">Attendance</div>
                                <div className={styles.attendanceInfo} data-name="Container" data-node-id="2253:12436">Present: 4 • Late: 0 • Absent: 1</div>
                            </div>
                            <div className={styles.attendanceLink} data-name="Link" data-node-id="2253:12437">
                                <a href="#">View attendance log</a>
                            </div>
                        </div>

                        {/* Grade Stats */}
                        <div className={styles.gradeStats} data-name="Container" data-node-id="2253:12439">
                            <div className={styles.gradeBackground} data-name="Background" data-node-id="2253:12440">
                                <span className={styles.gradeValue} data-node-id="2253:12443">B+</span>
                                <span className={styles.gradeLabel} data-node-id="2253:12445">Average Grade</span>
                                <span className={styles.gradeChange} data-node-id="2253:12447">↑ +1.2 from last month</span>
                            </div>
                            <div className={styles.gradeTrendContainer} data-name="Container" data-node-id="2253:12448">
                                <span className={styles.gradeTrendLabel} data-name="Container" data-node-id="2253:12450">Grade Trend</span>
                                <button className={styles.gradeTrendSelect} data-name="Button" data-node-id="2253:12451">
                                    <span data-node-id="2253:12452">Overall</span>
                                    <img src={imgSvg12} alt="" className={styles.gradeTrendArrow} data-node-id="2253:12453" />
                                </button>
                            </div>
                            <div className={styles.gradeBasis} data-name="Container" data-node-id="2253:12455">
                                <span data-node-id="2253:12456">Based on 6 quizzes (4 weeks)</span>
                            </div>
                            <div className={styles.gradeLink} data-name="Link" data-node-id="2253:12457">
                                <a href="#">View details</a>
                            </div>
                        </div>

                        {/* Wallet Stats */}
                        <div className={styles.walletStats} data-name="Container" data-node-id="2253:12459">
                            <div className={styles.walletBackground} data-name="Background" data-node-id="2253:12460">
                                <span className={styles.walletValue} data-node-id="2253:12463">$240</span>
                                <span className={styles.walletLabel} data-node-id="2253:12465">Wallet Balance</span>
                                <span className={styles.walletDue} data-node-id="2253:12467">Next due: Jan 30 ($120)</span>
                                <span className={styles.walletStatus} data-node-id="2253:12469">Covered ✓</span>
                            </div>
                            <div className={styles.walletPaymentContainer} data-name="Container" data-node-id="2253:12470">
                                <span className={styles.walletPaymentLabel} data-node-id="2253:12471">Payment Status</span>
                            </div>
                            <button className={styles.walletButton} data-name="Button" data-node-id="2253:12472">
                                <span data-node-id="2253:12473">Top up wallet</span>
                            </button>
                        </div>
                    </div>

                    {/* Insights Box */}
                    <div className={styles.insightsBox} data-name="Background+Border" data-node-id="2253:12474">
                        <div className={styles.insightsContent} data-name="Container" data-node-id="2253:12475">
                            <div className={styles.insightItem} data-name="Container" data-node-id="2253:12476">
                                <img src={imgSvg13} alt="" data-node-id="2253:12477" />
                                <span data-node-id="2253:12480">Math improved significantly in last 4 weeks</span>
                            </div>
                            <div className={styles.insightItem} data-name="Container" data-node-id="2253:12481">
                                <img src={imgSvg14} alt="" data-node-id="2253:12483" />
                                <span data-node-id="2253:12486">2 absences recorded this month</span>
                            </div>
                            <div className={styles.insightItem} data-name="Container" data-node-id="2253:12487">
                                <img src={imgSvg15} alt="" data-node-id="2253:12489" />
                                <span data-node-id="2253:12493">1 homework pending • </span>
                                <a href="#" data-node-id="2253:12494">View homework</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions} data-name="Quick Actions" data-node-id="2253:12496">
                    <div className={styles.quickActionContainer} data-name="Container" data-node-id="2253:12497">
                        <button className={`${styles.quickActionButton} ${styles.primary}`} data-name="Button" data-node-id="2253:12498">
                            <img src={imgSvg16} alt="" data-node-id="2253:12499" />
                            <span data-node-id="2253:12502">Message Tutor</span>
                        </button>
                    </div>
                    <button className={styles.quickActionButton} data-name="Button" data-node-id="2253:12503">
                        <img src={imgSvg17} alt="" data-node-id="2253:12504" />
                        <span data-node-id="2253:12507">Top Up Wallet</span>
                    </button>
                    <button className={styles.quickActionButton} data-name="Button" data-node-id="2253:12508">
                        <img src={imgSvg18} alt="" data-node-id="2253:12509" />
                        <span data-node-id="2253:12512">View Progress</span>
                    </button>
                    <button className={styles.quickActionButton} data-name="Button" data-node-id="2253:12513">
                        <img src={imgSvg19} alt="" data-node-id="2253:12514" />
                        <span data-node-id="2253:12517">Request Report</span>
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className={styles.mainContentGrid} data-name="Main Content Grid" data-node-id="2253:12518">
                    {/* Upcoming Lessons */}
                    <div className={styles.upcomingLessons} data-name="Upcoming Lessons" data-node-id="2253:12519">
                        <div className={styles.upcomingLessonsHeader} data-name="Container" data-node-id="2253:12520">
                            <h3 data-name="Heading 3" data-node-id="2253:12521">Upcoming Lessons</h3>
                            <a href="#" data-name="Link" data-node-id="2253:12523">View full schedule →</a>
                        </div>
                        <div className={styles.lessonsList} data-name="Container" data-node-id="2253:12525">
                            {/* Lesson 1 */}
                            <div className={`${styles.lessonCard} ${styles.highlighted}`} data-name="Background+Border" data-node-id="2253:12526">
                                <div className={styles.lessonCardMain} data-name="Container" data-node-id="2253:12527">
                                    <div className={styles.lessonIcon} data-name="Background" data-node-id="2253:12528">
                                        <img src={imgSvg20} alt="" data-node-id="2253:12530" />
                                    </div>
                                    <div className={styles.lessonInfo} data-name="Margin" data-node-id="2253:12532">
                                        <div className={styles.lessonTitle} data-name="Container" data-node-id="2253:12533">
                                            <span data-node-id="2253:12535">Math - Algebra</span>
                                        </div>
                                        <div className={styles.lessonTime} data-name="Container" data-node-id="2253:12536">
                                            <span data-node-id="2253:12537">Today, 4:00 PM • Tutor Sarah</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.lessonStatusContainer} data-name="Container" data-node-id="2253:12538">
                                    <div className={`${styles.lessonStatusBadge} ${styles.confirmed}`} data-name="Background" data-node-id="2253:12539">
                                        <span data-node-id="2253:12540">Confirmed</span>
                                    </div>
                                    <div className={styles.lessonViewButton} data-name="Button:margin" data-node-id="2253:12541">
                                        <span data-node-id="2253:12543">View</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lesson 2 */}
                            <div className={styles.lessonCard} data-name="Border" data-node-id="2253:12544">
                                <div className={styles.lessonCardMain} data-name="Container" data-node-id="2253:12545">
                                    <div className={styles.lessonIcon} data-name="Background" data-node-id="2253:12546">
                                        <img src={imgSvg21} alt="" data-node-id="2253:12548" />
                                    </div>
                                    <div className={styles.lessonInfo} data-name="Margin" data-node-id="2253:12550">
                                        <div className={styles.lessonTitle} data-name="Container" data-node-id="2253:12551">
                                            <span data-node-id="2253:12553">Physics - Motion</span>
                                        </div>
                                        <div className={styles.lessonTime} data-name="Container" data-node-id="2253:12554">
                                            <span data-node-id="2253:12555">Tomorrow, 2:00 PM • Mr. Davis</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.lessonStatusContainer} data-name="Container" data-node-id="2253:12556">
                                    <div className={styles.lessonStatusBadge} data-name="Background" data-node-id="2253:12557">
                                        <span data-node-id="2253:12558">Scheduled</span>
                                    </div>
                                    <div className={styles.lessonViewButton} data-name="Button:margin" data-node-id="2253:12559">
                                        <span data-node-id="2253:12561">View</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lesson 3 */}
                            <div className={styles.lessonCard} data-name="Border" data-node-id="2253:12562">
                                <div className={styles.lessonCardMain} data-name="Container" data-node-id="2253:12563">
                                    <div className={styles.lessonIcon} data-name="Background" data-node-id="2253:12564">
                                        <img src={imgSvg22} alt="" data-node-id="2253:12566" />
                                    </div>
                                    <div className={styles.lessonInfo} data-name="Margin" data-node-id="2253:12568">
                                        <div className={styles.lessonTitle} data-name="Container" data-node-id="2253:12569">
                                            <span data-node-id="2253:12571">English - Essay Writing</span>
                                        </div>
                                        <div className={styles.lessonTime} data-name="Container" data-node-id="2253:12572">
                                            <span data-node-id="2253:12573">Jan 22, 3:30 PM • Ms. Wilson</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.lessonStatusContainer} data-name="Container" data-node-id="2253:12574">
                                    <div className={styles.lessonStatusBadge} data-name="Background" data-node-id="2253:12575">
                                        <span data-node-id="2253:12576">Scheduled</span>
                                    </div>
                                    <div className={styles.lessonViewButton} data-name="Button:margin" data-node-id="2253:12577">
                                        <span data-node-id="2253:12579">View</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest Updates */}
                    <div className={styles.latestUpdates} data-name="Latest Updates" data-node-id="2253:12580">
                        {/* Latest Session Card */}
                        <div className={styles.updateCard} data-name="Background+Border" data-node-id="2253:12581">
                            <div className={styles.updateCardHeader} data-name="Container" data-node-id="2253:12582">
                                <h3 data-name="Heading 3" data-node-id="2253:12583">Latest Session</h3>
                                <span data-name="Container" data-node-id="2253:12585">Jan 18</span>
                            </div>
                            <div className={styles.updateCardContent} data-name="Container" data-node-id="2253:12587">
                                <p className={styles.updateDescription} data-name="Container" data-node-id="2253:12588">
                                    Emma showed excellent improvement in algebra<br />
                                    problem-solving. Completed all practice problems.
                                </p>
                                <div className={styles.updateInfo} data-name="Container" data-node-id="2253:12590">
                                    <span className={styles.updateInfoLabel} data-name="Container" data-node-id="2253:12591">Homework assigned</span>
                                    <span className={styles.updateInfoValue} data-name="Container" data-node-id="2253:12593">Yes</span>
                                </div>
                                <button className={styles.updateButton} data-name="Button" data-node-id="2253:12595">
                                    <span>View Full Report</span>
                                </button>
                            </div>
                        </div>

                        {/* Needs Attention Card */}
                        <div className={styles.attentionCard} data-name="Background+Border" data-node-id="2253:12597">
                            <h3 data-name="Heading 3" data-node-id="2253:12598">Needs Attention</h3>
                            <div className={styles.attentionContent} data-name="Background+Border" data-node-id="2253:12600">
                                <div className={styles.attentionIcon} data-name="Margin" data-node-id="2253:12601">
                                    <img src={imgSvg23} alt="" data-node-id="2253:12602" />
                                </div>
                                <div className={styles.attentionDetails} data-name="Margin" data-node-id="2253:12604">
                                    <div className={styles.attentionTitle} data-name="Container" data-node-id="2253:12607">
                                        <span>Payment Due Soon</span>
                                    </div>
                                    <div className={styles.attentionDescription} data-name="Container" data-node-id="2253:12609">
                                        <span>Next payment due Jan 30</span>
                                    </div>
                                    <div className={styles.attentionButton} data-name="Button" data-node-id="2253:12610">
                                        <span>Pay Now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
