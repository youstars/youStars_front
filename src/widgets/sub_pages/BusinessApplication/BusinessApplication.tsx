import React, { useEffect } from "react";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import BusinessApplicationCard from "./components/BusinessApplicationCard/BusinessApplicationCard";
import styles from "./BusinessApplication.module.scss";
import { getOrders } from "shared/store/slices/funnelSlice";
import { selectFunnel } from "shared/store/slices/funnelSlice";

export default function BusinessApplication() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFunnel);
  const status = useAppSelector((state) => state.funnel.status);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (status === "pending") return <p>Загрузка заявок...</p>;

  return (
    <div className={styles.pageContainer}>
      {orders.map((order) => (
        <BusinessApplicationCard key={order.id} order={order} />
      ))}
    </div>
  );
}
