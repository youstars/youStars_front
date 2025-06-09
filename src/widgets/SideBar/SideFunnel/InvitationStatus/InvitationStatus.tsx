import React from "react";
import Check from "shared/assets/sideBarFunnelIcons/Check Icon.svg";
import Cross from "shared/assets/sideBarFunnelIcons/Hourglass Icon.svg"; 
import HourGlass from "shared/assets/sideBarFunnelIcons/Hourglass Icon.svg"; 

interface Props {
  status: string;
  isApproved: boolean;
}

const InvitationStatusIcon: React.FC<Props> = ({ status, isApproved }) => {
  if (isApproved) return <img src={Check} alt="Утверждён" title="Утверждён" />;

  if (status === "ACCEPTED") return <img src={HourGlass} alt="Ожидает утверждения" title="Ожидает утверждения" />;

  if (status === "REJECTED") return <img src={Cross} alt="Отклонено" title="Отклонено" />;

  return <img src={HourGlass} alt="Ожидает ответа" title="Ожидает ответа" />;
};

export default InvitationStatusIcon;