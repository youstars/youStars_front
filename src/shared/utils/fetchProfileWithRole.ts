import axiosInstance from "shared/api/api";

export const fetchProfileWithRole = async (endpoint: string, role: string) => {
  const { data } = await axiosInstance.get(endpoint);
  return { ...data, role };
};
