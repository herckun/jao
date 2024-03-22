import type { APIRoute } from "astro";
import { eq, max } from "drizzle-orm";
import { Account, Balance, Token } from "../../../server/db/schema";
import RpcHandler from "../../../server/lib/RpcHandler";
import { ethereum } from "../../../server/lib/chains/ethereum";
import { optimism } from "../../../server/lib/chains/optimism";
import { polygon } from "../../../server/lib/chains/polygon";
import { dymension } from "../../../server/lib/chains/dymension";
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
  await db
    .insert(Account)
    .values({
      wallet: wallet as string,
    })
    .onConflictDoNothing();

  const tokens = await db.select().from(Token);
  let rh = null;
  let i = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (rh == null || tokens[i].chainId != rh.rpc.chainId) {
      switch (tokens[i].chainId) {
        case 1:
          rh = new RpcHandler(ethereum);
          break;
        case 10:
          rh = new RpcHandler(optimism);
          break;
        case 137:
          rh = new RpcHandler(polygon);
          break;
        case 1100:
          rh = new RpcHandler(dymension);
      }

      if (rh == null) continue;
    }

    if (tokens[i].contract == rh.rpc.nativeSymbol) {
      let nativeBalance = (await rh?.getWalletNativeBalance(wallet as string))
        ?.balance as number;
      if (nativeBalance > 0.0001) {
        await db.insert(Balance).values({
          account_wallet: wallet as string,
          balance: (nativeBalance * Math.pow(10, 18 as number)).toString(),
          token_contract: rh.rpc.nativeSymbol as string,
        });
      }
      continue;
    }

    let token = tokens[i];
    let getBalance = await rh.getWalletTokenBalance(
      wallet as string,
      token.contract as string
    );
    let balance = (getBalance.balance as number) ?? 0;

    if (balance < 0.00001) {
      continue;
    }
    i++;
    let balanceString = (
      balance * Math.pow(10, token.decimals as number)
    ).toLocaleString("fullwide", {
      useGrouping: false,
      maximumSignificantDigits: token.decimals as number,
    });

    await db.insert(Balance).values({
      account_wallet: wallet as string,
      balance: balanceString,
      token_contract: token.contract as string,
    });
  }

  return new Response(
    JSON.stringify({
      msg: "Balances have been synced with blockchain data",
      count: i,
      timestamp: new Date().getTime(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
