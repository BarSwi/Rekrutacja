import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { customAxios } from "./interceptor";
import { queryClient } from "../../App";

//#region getSingle
export function getSingleQuery(name: string) {
  return (id: string) => ({
    queryKey: [name, { id }],
    queryFn: async () => {
      const response = await customAxios.get(`/${name}/single`, {
        params: { id },
      });
      const { data } = response;

      return data;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
//#endregion
//#region getPaginated
export function getPaginatedQuery(
  name: string,
  options: {
    saveCache?: boolean;
  }
) {
  return (pageIndex: number, rowsPerPage: number) => ({
    queryKey: [`${name}-paginated`, { pageIndex }],
    queryFn: async () => {
      const { data } = await customAxios.get(`${name}/paginated`, {
        params: { page: pageIndex, pageSize: rowsPerPage },
      });
      if (options?.saveCache) {
        data.data.forEach((item: { id: string }) => {
          queryClient.setQueryData([name, { id: item.id }], {
            data: item,
          });
        });
      }
      return data;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
//#endregion
//#region getUnpopulated
export function getAllUnpopulatedQuery(name: string) {
  return () => ({
    queryKey: [`${name}-options`],
    queryFn: async () => {
      const { data } = await customAxios.get(`${name}/options`, {
        params: {},
      });
      return data;
    },

    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
//#endregion
//#region update
export function updateMutation(name: string) {
  return (successMessage?: string) => ({
    mutationFn: async (data: any) => {
      const { id, ...payload } = data.data;
      const response = await customAxios.put(`${name}/${id}`, payload);
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success(successMessage, {
        duration: 5000,
      });

      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [`${name}-paginated`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${name}-options`],
      });

      queryClient.setQueryData([name, { id: data.data.id }], data);
    },
  });
}
//#endregion
//#region create
export function createMutation(name: string) {
  return (successMessage?: string) => ({
    mutationFn: async (data: { data: any }) => {
      const response = await customAxios.post(`${name}/create`, data);
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success(successMessage, {
        duration: 5000,
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [`${name}-paginated`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${name}-options`],
      });
      queryClient.setQueryData([name, { id: data.data.id }], data);
    },
  });
}
//#endregion
//#region delete
export function deleteMutation(name: string) {
  return (successMessage?: string) => ({
    mutationFn: async (data: { id: string }) => {
      const response = await customAxios.delete(`${name}/${data.id}`);
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success(successMessage, {
        duration: 5000,
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [`${name}-paginated`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${name}-options`],
      });
      queryClient.invalidateQueries({
        queryKey: [name, { id: data.id }],
      });
    },
  });
}
//#region Utils
// const createAuthHeader = async () => {
//   const JWT = await auth.currentUser.getIdToken();
//   return { Authorization: `Bearer ${JWT}` };
// };

//#endregion
//#region singleItem
const singleItem = {
  getPaginated: getPaginatedQuery("singleItem", { saveCache: false }),
  getAllUnpopulated: getAllUnpopulatedQuery("singleItem"),
  getSingle: getSingleQuery("singleItem"),
  create: createMutation("singleItem"),
  update: updateMutation("singleItem"),
  delete: deleteMutation("singleItem"),
};
//#endregion
//#region ingredientSelectionGroup
const estimate = {
  getPaginated: getPaginatedQuery("estimate", { saveCache: false }),
  getAllUnpopulated: getAllUnpopulatedQuery("estimate"),
  getSingle: getSingleQuery("estimate"),
  create: createMutation("estimate"),
  update: updateMutation("estimate"),
  delete: deleteMutation("estimate"),
};
//#endregion
const api = {
  singleItem,
  estimate,
};

export default api;
