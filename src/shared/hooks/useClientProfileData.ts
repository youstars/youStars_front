import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { getClientById } from "shared/store/slices/clientSlice";

export function useClientProfileData(externalClient?: any) {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { data: reduxClient, loading, error } = useAppSelector((s) => s.client);

  useEffect(() => {
    if (!externalClient && id) {
      dispatch(getClientById(+id));
    }
  }, [dispatch, id, externalClient]);

  const client = externalClient || reduxClient;

  return {
    client,
    loading,
    error,
  };
}
