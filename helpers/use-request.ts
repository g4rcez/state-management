import { stringifyUrl } from "query-string";
import { useMemo } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { QueryString } from "./api";
import { stringify } from "query-string";

export const useRequest = <T>(url: string | null, queryString: Record<string, any> | undefined, fetcher: any) => {
  const localUrl: string = useMemo(() => (url === null ? null : stringifyUrl({ url, query: queryString })), [url, queryString]);
  const swr = useSWR<{ body: T }>(localUrl, fetcher);
  return { ...swr, loading: !swr.data && !swr.error };
};

export const useQs = (): [qs: QueryString, setQs: (newQs: QueryString) => void] => {
  const { push, query } = useRouter();
  const setQs = useCallback((newQs: QueryString) => push({ search: stringify(newQs) }), [push]);
  return useMemo(() => [query, setQs], [query, setQs]);
};
