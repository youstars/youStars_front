import React from "react";
import styles from "./OrderDropdown.module.scss";

interface OrdersDropdownProps<T> {
  items: T[];
  isOpen: boolean;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

function OrdersDropdown<T>({
  items,
  isOpen,
  onSelect,
  renderItem,
  emptyMessage = "Нет данных",
}: OrdersDropdownProps<T>) {
  if (!isOpen) return null;

  return (
    <div className={styles.ordersDropdown}>
      {items.length > 0 ? (
        items.map((item, idx) => (
          <div
            key={idx}
            className={styles.orderItem}
            onClick={() => onSelect(item)}
          >
            {renderItem(item)}
          </div>
        ))
      ) : (
        <div>{emptyMessage}</div>
      )}
    </div>
  );
}

export default OrdersDropdown;
