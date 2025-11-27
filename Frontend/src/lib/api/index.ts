import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { customAxios } from "./interceptor";
import { queryClient } from "../../App";

type ResourceConfig = {
  baseUrl?: string;
  getSingleUrl?: string;
  getPaginatedUrl?: string;
  createUrl?: string;
  updateUrl?: string;
  deleteUrl?: string;
  name: string;
  invalidateKeys?: string[];
};

const buildUrl = (template: string, params: Record<string, any>): string => {
  let url = template;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

const extractParams = (
  template: string,
  payload: Record<string, any>
): Record<string, any> => {
  const params: Record<string, any> = {};
  const paramNames = template.match(/:(\w+)/g)?.map((p) => p.slice(1)) || [];
  paramNames.forEach((name) => {
    if (payload[name]) params[name] = payload[name];
  });
  return params;
};

export function createResource(config: ResourceConfig) {
  const {
    baseUrl = "",
    name,
    invalidateKeys = [name],
    getSingleUrl = baseUrl,
    getPaginatedUrl = baseUrl,
    createUrl = baseUrl,
    updateUrl = baseUrl,
    deleteUrl = baseUrl,
  } = config;

  return {
    getSingle: (id: string) => ({
      queryKey: [name, { id }],
      queryFn: async () => {
        const { data } = await customAxios.get(`/${getSingleUrl}/${id}`);
        return data;
      },
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }),

    getPaginated: (page: number, pageSize: number) => ({
      queryKey: [`${name}-paginated`, { page }],
      queryFn: async () => {
        const { data } = await customAxios.get(`/${getPaginatedUrl}`, {
          params: { page, pageSize },
        });
        return data;
      },
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }),

    create: (successMessage?: string) => ({
      mutationFn: async (payload: any) => {
        const params = extractParams(createUrl, payload);
        const url = `/${buildUrl(createUrl, params)}`;
        const { data } = await customAxios.post(url, payload);
        return data;
      },
      onSuccess: (data: any) => {
        toast.success(successMessage, { duration: 5000 });
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      },
    }),

    update: (successMessage?: string) => ({
      mutationFn: async (payload: any) => {
        const { id, ...rest } = payload;
        const params = { ...extractParams(updateUrl, rest), id };
        const url = `/${buildUrl(updateUrl, params)}`;
        const { data } = await customAxios.put(url, rest);
        return { id, ...data };
      },
      onSuccess: (data: any) => {
        toast.success(successMessage, { duration: 5000 });
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
        queryClient.invalidateQueries({ queryKey: [name, { id: data.id }] });
      },
    }),

    delete: (successMessage?: string) => ({
      mutationFn: async (payload: any) => {
        const params = extractParams(deleteUrl, payload);
        const url = `/${buildUrl(deleteUrl, params)}`;
        const { data } = await customAxios.delete(url);
        return data;
      },
      onSuccess: () => {
        toast.success(successMessage, { duration: 5000 });
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      },
    }),
  };
}

//#endregion
//#region estimate
const estimate = createResource({
  baseUrl: "estimate",
  name: "estimate",
  invalidateKeys: ["estimate-paginated", "estimate"],
  updateUrl: "estimate/:id",
  deleteUrl: "estimate/:id",
});
//#endregion
//#region single-item (nested)
const singleItem = createResource({
  baseUrl: "estimate/:id/single-item",
  updateUrl: "estimate/:estimateId/single-item/:itemId",
  deleteUrl: "estimate/:estimateId/single-item/:itemId",
  name: "singleItem",
  invalidateKeys: ["estimate-paginated", "estimate"],
});
//#endregion
const api = {
  estimate,
  singleItem,
};

export default api;
