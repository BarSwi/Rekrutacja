import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { customAxios } from "./interceptor";
import { queryClient } from "../../App";

type ResourceConfig = {
  baseUrl: string;
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
  const { baseUrl, name, invalidateKeys = [name] } = config;

  return {
    getSingle: (id: string) => ({
      queryKey: [name, { id }],
      queryFn: async () => {
        const { data } = await customAxios.get(`/${baseUrl}/${id}`);
        return data;
      },
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }),

    getPaginated: (page: number, pageSize: number) => ({
      queryKey: [`${name}-paginated`, { page }],
      queryFn: async () => {
        const { data } = await customAxios.get(`/${baseUrl}`, {
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
        const params = extractParams(baseUrl, payload);
        const url = `/${buildUrl(baseUrl, params)}`;
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
        const params = { ...extractParams(baseUrl, rest), id };
        const url = `/${buildUrl(baseUrl, params)}/${id}`;
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
      mutationFn: async (id: string) => {
        const { data } = await customAxios.delete(`/${baseUrl}/${id}`);
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
});
//#endregion
//#region single-item (nested)
const singleItem = createResource({
  baseUrl: "estimate/:estimateId/single-item",
  name: "singleItem",
  invalidateKeys: ["estimate-paginated", "estimate"],
});
//#endregion
const api = {
  estimate,
  singleItem,
};

export default api;
