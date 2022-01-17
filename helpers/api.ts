import { NextApiRequest } from "next";

export namespace Nasa {
  export type CloseApproachData = {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  };

  export type NearEarthObject = {
    links: {
      self: string;
    };
    id: string;
    neo_reference_id: string;
    name: string;
    nasa_jpl_url: string;
    absolute_magnitude_h: number;
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
      meters: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
      miles: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
      feet: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
    };
    is_potentially_hazardous_asteroid: boolean;
    close_approach_data: CloseApproachData[];
    is_sentry_object: boolean;
  };

  export type Feed = {
    element_count: number;
    near_earth_objects: Record<string, NearEarthObject[]>;
    links: { next: string; prev: string; self: string };
  };
  export const endpoints = {
    feed: "https://api.nasa.gov/neo/rest/v1/feed",
    clientFeed: "/api/feed",
    http: "https://neowsapp.com/rest/v1/neo/",
    neo: (id: string) => `http://www.neowsapp.com/rest/v1/neo/${id}`,
    clientNeo: (id: string) => `/api/neo?name=${id}`,
  };
}

export type QueryString = NodeJS.Dict<string | string[]>;

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw response;
  }
  return response.json();
};

export const nasaToken = (req: NextApiRequest) => req.headers["X-NASA-TOKEN"] || process.env.NASA_TOKEN;
