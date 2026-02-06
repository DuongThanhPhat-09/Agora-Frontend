import React from 'react';
import styles from './RecentlyLinkedCard.module.css';

// Image assets from Figma
const imgAvatarEmmaSmall = 'https://www.figma.com/api/mcp/asset/cfca899b-05ce-4649-a9ee-f3937cc7d91b';
const imgAvatarAlexSmall = 'https://www.figma.com/api/mcp/asset/eefd9b76-3816-4755-aff8-45c08974e351';

export interface RecentlyLinkedItem {
    name: string;
    avatar?: string;
    linkedDate: string;
    timeAgo: string;
}

export interface RecentlyLinkedCardProps {
    items: RecentlyLinkedItem[];
}

const RecentlyLinkedCard = ({ items }: RecentlyLinkedCardProps) => {
    return (
        <div className={styles.card} data-name="Background+Border">
            {items.map((item, index) => {
                const avatarSrc = item.name.includes('Emma') ? imgAvatarEmmaSmall : imgAvatarAlexSmall;

                return (
                    <React.Fragment key={index}>
                        {/* Item */}
                        <div className={styles.item} data-name="Container">
                            <div className={styles.itemLeft} data-name="Container">
                                <div className={styles.avatarSmall} data-name={item.name}>
                                    <img src={avatarSrc} alt="" className={styles.avatarSmallImage} />
                                </div>
                                <div className={styles.itemInfo} data-name="Margin">
                                    <p className={styles.itemName} data-name="Container">{item.name}</p>
                                    <p className={styles.itemLinkedDate} data-name="Container">{item.linkedDate}</p>
                                </div>
                            </div>
                            <div className={styles.itemTime} data-name="Container">
                                <p className={styles.itemTimeText}>{item.timeAgo}</p>
                            </div>
                        </div>

                        {/* Divider - Not for last item */}
                        {index < items.length - 1 && (
                            <div className={styles.divider} data-name="HorizontalBorder"></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default RecentlyLinkedCard;
