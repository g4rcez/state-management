import { NextApiRequest, NextApiResponse } from "next";
import { stringifyUrl } from "query-string";
import { fetcher, Nasa } from "../../helpers/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const NASA_API_KEY = req.headers["X-NASA-TOKEN"] || process.env.NASA_TOKEN;
  const response = await fetcher(
    stringifyUrl({
      url: Nasa.endpoints.neo(req.query.name as string),
      query: { api_key: NASA_API_KEY },
    })
  );
  try {
    return res.json({ success: true, body: response });
  } catch (error) {
    res.status(400);
    return res.json({ success: false, body: error });
  }
}
