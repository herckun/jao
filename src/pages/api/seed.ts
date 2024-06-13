import type { APIRoute } from "astro";
import type { IToken } from "../../server/db/seeders/seed_tokens";
import seed_tokens from "../../server/db/seeders/seed_tokens";
import seed_accounts from "../../server/db/seeders/seed_accounts";
import seed_chains from "../../server/db/seeders/seed_chains";

export const GET: APIRoute = async ({ params, request }) => {
  const chains = [
    "dymension",
    "ethereum",
    "optimism",
    "polygon",
    "nim",
    "base",
  ];

  let tokens: Array<IToken> = [];

  for (let i = 0; i < chains.length; i++) {
    const f = await fetch(
      `http://${new URL(request.url).host}/assets/lists/${chains[i]}.json`
    );
    const data: Array<IToken> = (await f.json()) ?? [<IToken>{}];
    if (data == null) {
      continue;
    }
    data.forEach((token) => {
      tokens.push(token);
    });
  }

  let ids: Array<string> = [];
  tokens.forEach((a) => {
    ids.push(a.coingeckoId?.toLowerCase() as string);
  });

  let f = await fetch(
    `${new URL(request.url).protocol}//${
      new URL(request.url).host
    }/api/coingecko/data`,

    {
      method: "POST",
      body: JSON.stringify({
        ids: ids,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let coingeckodata = await f.json();

  await seed_tokens(coingeckodata.data, tokens);
  await seed_accounts();
  await seed_chains();

  return new Response(null, {
    status: 200,
  });
};
