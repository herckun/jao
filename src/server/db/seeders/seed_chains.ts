import { base } from "../../lib/chains/base";
import { dymension } from "../../lib/chains/dymension";
import { ethereum } from "../../lib/chains/ethereum";
import { nim } from "../../lib/chains/nim";
import { optimism } from "../../lib/chains/optimism";
import { polygon } from "../../lib/chains/polygon";
import type { Rpc } from "../../lib/RpcHandler";
import db from "../database";
import { Chain } from "../schema";

const insertChain = async (chain: Rpc) => {
  await db
    .insert(Chain)
    .values({
      name: chain.name,
      chainId: chain.chainId,
      nativeSymbol: chain.nativeSymbol,
      iconURI: chain.iconURI,
    })
    .onConflictDoUpdate({
      target: Chain.chainId,
      set: {
        name: chain.name,
        chainId: chain.chainId,
        nativeSymbol: chain.nativeSymbol,
        iconURI: chain.iconURI,
      },
    });
};

const seed_chains = async () => {
  await insertChain(ethereum);
  await insertChain(polygon);
  await insertChain(optimism);
  await insertChain(dymension);
  await insertChain(base);
  await insertChain(nim);
};
export default seed_chains;
