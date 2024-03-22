import db from "../database";
import { Token } from "../schema";
import fs from "fs";
import path from "path";

export type IToken = {
  name: string;
  chainId: number;
  contract: string;
  decimals: number;
  coingeckoId: string;
  iconURI: string;
};

const seed_tokens = async (
  coingeckodata: Array<any>,
  tokens: Array<IToken>
) => {
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let data = coingeckodata.filter((a) => a.id == token.coingeckoId);
    await db
      .insert(Token)
      .values({
        name: token.name,
        chainId: token.chainId,
        contract: token.contract,
        decimals: token.decimals,
        coingeckoId: token.coingeckoId,
        iconURI: token.iconURI ?? (data[0] == undefined ? "" : data[0].image),
      })
      .onConflictDoUpdate({
        target: Token.contract,
        set: {
          name: token.name,
          chainId: token.chainId,
          contract: token.contract,
          decimals: token.decimals,
          coingeckoId: token.coingeckoId,
          iconURI: token.iconURI ?? (data[0] == undefined ? "" : data[0].image),
        },
      });
  }
};
export default seed_tokens;
