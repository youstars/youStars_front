import { useCallback } from "react";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { getOrderById } from "shared/store/slices/orderSlice";
import { getFunnelData } from "shared/store/slices/funnelSlice";

export const useOrder = (orderId: string | undefined) => {
    const dispatch = useAppDispatch();
    const order = useAppSelector((s) => s.order.current);
    const loading = useAppSelector((s) => s.order.loading); 
    const error = useAppSelector((s) => s.order.error); 

    const refresh = useCallback(async () => {
        if (orderId) {
            await dispatch(getOrderById(orderId));
            await dispatch(getFunnelData());
        }
    }, [dispatch, orderId]);

    return { order, loading, error, refresh };
};