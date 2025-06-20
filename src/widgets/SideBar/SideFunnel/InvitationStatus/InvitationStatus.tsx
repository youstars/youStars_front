import React from "react";
import Check from "shared/assets/sideBarFunnelIcons/Check Icon.svg";
import Cross from "shared/assets/sideBarFunnelIcons/Hourglass Icon.svg";
import HourGlass from "shared/assets/sideBarFunnelIcons/Hourglass Icon.svg"; 
import styles from "./InvitationStatus.module.scss";

interface Props {
  status: string;
  isApproved: boolean;
}

const InvitationStatusIcon: React.FC<Props> = ({ status, isApproved }) => {
  if (isApproved) return <img src={Check} className={styles.icon} alt="Утверждён" title="Утверждён" />;

  if (status === "ACCEPTED") return <img src={HourGlass} className={styles.icon} alt="Ожидает утверждения" title="Ожидает утверждения" />;

  if (status === "REJECTED") return <img src={Cross} className={styles.icon} alt="Отклонено" title="Отклонено" />;

  return <img src={HourGlass} className={styles.icon} alt="Ожидает ответа" title="Ожидает ответа" />;
};

export default InvitationStatusIcon;