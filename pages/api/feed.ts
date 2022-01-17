import { NextApiRequest, NextApiResponse } from "next";
import { stringifyUrl } from "query-string";
import { fetcher, Nasa } from "../../helpers/api";

const isoDate = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const NASA_API_KEY = req.headers["X-NASA-TOKEN"] || process.env.NASA_TOKEN;
  const now = new Date();
  const response = await fetcher(
    stringifyUrl({
      url: Nasa.endpoints.feed,
      query: {
        start_date: isoDate(now),
        end_date: isoDate(now),
        api_key: NASA_API_KEY,
      },
    })
  );
  try {
    return res.json({ success: true, body: response });
  } catch (error) {
    res.status(400);
    return res.json({ success: false, body: error });
  }
}
