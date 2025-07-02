import React from "react";
import classes from "../../SideFunnel.module.scss";
import EditableField from "../../components/EditableField/EditableField";
import { getInitials } from "shared/helpers/userUtils";
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
            {trackerData?.custom_user?.full_name ? (
                <div className={classes.trackers}>
          <span
              className={classes.avatarPlaceholder}
              title={trackerData.custom_user.full_name}
              aria-label={trackerData.custom_user.full_name}
          >
            {getInitials(trackerData.custom_user.full_name)}
          </span>
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