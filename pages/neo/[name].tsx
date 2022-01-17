import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import { Flex } from "../../components/flex";
import { fetcher, Nasa } from "../../helpers/api";
import { useRequest } from "../../helpers/use-request";

type Query = { name: string };

export default function NeoNameDetail(props) {
  const { query } = useRouter();
  const name = query.name as string;
  const response = useRequest<Nasa.NearEarthObject>(Nasa.endpoints.clientNeo(name), undefined, fetcher);
  const data = useMemo((): Partial<Nasa.NearEarthObject> => response.data?.body ?? {}, [response.data]);
  return (
    <Flex>
      <h1 className="text-5xl font-bold">{data.name}</h1>
    </Flex>
  );
}
