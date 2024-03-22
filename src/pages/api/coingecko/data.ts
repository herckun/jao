import type { APIRoute } from "astro";
import CoingeckoHandler from "../../../server/lib/CoingeckoHandler";

const COINGECKO_API_KEY = import.meta.env.COINGECKO_API_KEY;

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const ids = body.ids;
    const ch = new CoingeckoHandler(
      "https://api.coingecko.com/api/v3",
      COINGECKO_API_KEY
    );
    const data = await ch.getCoinsData(ids);
    return new Response(
      JSON.stringify({
        data,
      }),
      {
        status: 200,
      }
    );
  }
  return new Response(null, { status: 400 });
};
