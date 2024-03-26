import type { APIRoute } from "astro";
import { Balance, Chain, Token } from "../../../server/db/schema";
import { eq, max } from "drizzle-orm";
import db from "../../../server/db/database";

export const GET: APIRoute = async ({ params, request }) => {
  const wallet = params.wallet?.toString().toLocaleLowerCase();

  if (
    wallet == null ||
    wallet == undefined ||
    wallet == "" ||
    typeof wallet != "string"
  ) {
    return new Response(null, {
      status: 500,
    });
  }

  const sq = db
    .select({
      max: max(Balance.id).as("max"),
    })
    .from(Balance)
    .where(eq(Balance.account_wallet, `${wallet}`))
    .groupBy(Balance.token_contract)
    .as("sq");
  const account = await db
    .select({
      wallet: Balance.account_wallet,
      balance: Balance.balance,
      contract: Balance.token_contract,
      name: Token.name,
      decimals: Token.decimals,
      chain: Token.chainId,
      coingeckoId: Token.coingeckoId,
      iconURI: Token.iconURI,
      chainIconURI: Chain.iconURI,
    })
    .from(Balance)
    .where(eq(Balance.account_wallet, `${wallet}`))
    .innerJoin(sq, eq(Balance.id, sq.max))
    .innerJoin(Token, eq(Token.contract, Balance.token_contract))
    .innerJoin(Chain, eq(Chain.chainId, Token.chainId));

  if (!account || account == null) {
    return new Response(null, {
      status: 500,
    });
  }

  let ids: Array<string> = [];
  account.forEach((a) => {
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

  let res: Array<any> = [];
  account.forEach((a) => {
    let balance =
      parseInt(a.balance as string) / Math.pow(10, a.decimals as number);
    let data = coingeckodata.data.filter((x: any) => x.id == a.coingeckoId);

    res.push({
      wallet: a.wallet,
      balance: balance,
      token: {
        name: a.name,
        contract: a.contract,
        decimals: a.decimals,
        iconURI: a.iconURI,
        unitPrice: data[0] == undefined ? 0 : data[0].current_price,
        totalValue: data[0] == undefined ? 0 : data[0].current_price * balance,
        price_change: {
          hour: data[0].price_change_percentage_1h_in_currency,
          day: data[0].price_change_percentage_24h_in_currency,
          week: data[0].price_change_percentage_7d_in_currency,
          month: data[0].price_change_percentage_30d_in_currency,
          year: data[0].price_change_percentage_1y_in_currency,
        },
      },
      chain: {
        id: a.chain,
        iconURI: a.chainIconURI,
      },
    });
  });
  res = res.sort((a, b) => {
    return b.token.totalValue - a.token.totalValue;
  });

  return new Response(
    JSON.stringify({
      msg: "success",
      result: res,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
