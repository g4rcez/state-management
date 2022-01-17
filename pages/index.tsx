import { useMemo } from "react";
import { Flex } from "../components/flex";
import { column, Table } from "../components/table";
import { fetcher, Nasa } from "../helpers/api";
import { useRequest } from "../helpers/use-request";
import { MdRemoveRedEye } from "react-icons/md";
import Link from "next/link";

const col = column<Nasa.NearEarthObject>();

const cols = [
  col("id", {
    header: "ID",
    Component: (props) => (
      <Link href={`/neo/${props.value}`} passHref>
        <a className="hover:underline focus:underline hover:text-blue-300 focus:text-blue-300" href={`/neo/${props.value}`}>
          {props.value}
        </a>
      </Link>
    ),
  }),
  col("name", { header: "Name" }),
  col("absolute_magnitude_h", { header: "Magnitude" }),
  col("estimated_diameter", {
    header: "Diameter (Km)",
    Component: (props) => props.value.kilometers.estimated_diameter_max,
  }),
  col("nasa_jpl_url", {
    header: "Jet Propulsion Laboratory",
    cell: { style: { textAlign: "center" } },
    props: { className: "flex items-center justify-center" },
    Component: (props) => (
      <a
        href={props.value}
        rel="noopener noreferrer"
        target="_blank"
        className="hover:underline focus:underline hover:text-blue-300 focus:text-blue-300 w-full text-center flex items-center justify-center"
      >
        <MdRemoveRedEye aria-hidden="true" />
      </a>
    ),
  }),
];

export default function Home() {
  const response = useRequest<Nasa.Feed>(Nasa.endpoints.clientFeed, undefined, fetcher);

  const items = useMemo(() => {
    if (response.data === undefined) return [];
    const nearEarth = response.data.body.near_earth_objects;
    const firstKey = Object.keys(nearEarth)[0];
    return nearEarth[firstKey];
  }, [response.data]);

  return (
    <Flex>
      <Table loading={response.loading} columns={cols} items={items} name="planets" reference="id" />
    </Flex>
  );
}
