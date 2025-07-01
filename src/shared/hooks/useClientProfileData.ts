import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { getClientById } from "shared/store/slices/clientSlice";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

export const useClientProfileData = (externalClient: any) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const state = useAppSelector((state) => state.client);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!externalClient && id && !fetchedRef.current) {
      dispatch(getClientById(+id));
      fetchedRef.current = true;
    }
  }, [externalClient, id, dispatch]);

  return {
    client: externalClient || state.data,
    loading: state.loading,
  };
};
