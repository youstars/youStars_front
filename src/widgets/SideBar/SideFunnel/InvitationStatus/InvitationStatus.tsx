import React from "react";
import Check from "shared/assets/sideBarFunnelIcons/CheckIcon.svg";
import Cross from "shared/assets/sideBarFunnelIcons/CrossIcon.svg";
import HourGlass from "shared/assets/sideBarFunnelIcons/HourglassIcon.svg";
import styles from "./InvitationStatus.module.scss";

interface Props {
  status: string;
  isApproved: boolean;
}

const InvitationStatusIcon: React.FC<Props> = ({ status, isApproved }) => {
  if (isApproved) return <img src={Check} className={styles.icon} alt="Утверждён" title="Утверждён" />;

  if (status === "ACCEPTED") return <img src={Check} className={styles.icon} alt="Принято" title="Принято" />;

  if (status === "PENDING") return <img src={HourGlass} className={styles.icon} alt="Ожидает утверждения" title="Ожидает утверждения" />;

  if (status === "DECLINED") return <img src={Cross} className={styles.icon} alt="Отклонено" title="Отклонено" />;

  return <div className={styles.icon}> ? </div>;
};

export default InvitationStatusIcon;