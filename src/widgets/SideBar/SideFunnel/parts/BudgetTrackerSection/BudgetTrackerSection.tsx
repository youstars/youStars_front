import React from "react";
import classes from "../../SideFunnel.module.scss";
import EditableField from "../../components/EditableField/EditableField";
import Avatar from "shared/UI/AvatarMini/Avatar";
import { OrderStatus } from "../../SideFunnel";

export interface BudgetTrackerSectionProps {
    status: OrderStatus;
    budgetValue: string;
    onBudgetSave: (newBudget: string) => void;
    trackerData: { custom_user: { full_name: string; id: number } } | null;
    onBecomeTracker: () => void;
}

const BudgetTrackerSection: React.FC<BudgetTrackerSectionProps> = ({
                                                                       status,
                                                                       budgetValue,
                                                                       onBudgetSave,
                                                                       trackerData,
                                                                       onBecomeTracker,
                                                                   }) => (
    <div className={classes.funnelInfo}>
        {/* Редактирование бюджета */}
        <div className={classes.sum}>
            <p>Бюджет</p>
            <div className={classes.sumValue}>
              <EditableField
                  value={budgetValue}
                  onSave={onBudgetSave}
                  canEdit={status === OrderStatus.Matching}
                  type="number"
                  placeholder="0"
                  displayFormatter={(v) => (v ? `${v} ₽` : "—")}
              />
            </div>
        </div>

        {/* Информация и назначение трекера */}
        <div className={classes.sum}>
            <p>Трекер</p>
            {trackerData?.custom_user ? (
                <div className={classes.trackers}>
                  <Avatar
                    avatar={(trackerData.custom_user as any).avatar}
                    fullName={trackerData.custom_user.full_name}
                    size="sm"
                    className={classes.avatarPlaceholder}
                  />
                </div>
            ) : (
                <button
                    type="button"
                    className={classes.becomeTrackerButton}
                    onClick={onBecomeTracker}
                >
                    Стать трекером
                </button>
            )}
        </div>
    </div>
);

export default BudgetTrackerSection;