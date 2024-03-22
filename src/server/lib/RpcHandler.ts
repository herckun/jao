export type Rpc = {
  name: string;
  chainId: number;
  url: string;
  nativeSymbol: string;
  iconURI?: string
};

export type BalanceResponse = {
  wallet: string;
  balance: number;
  decimals: number;
  contract?: string;
};


export default class RpcHandler {
  rpc: Rpc;

  constructor(rpc?: Rpc) {
    this.rpc = rpc ?? {
      name: "polygon",
      chainId: 137,
      url: "https://polygon-rpc.com",
      nativeSymbol: "MATIC",
    };
  }

  async rpcCall(method: string, params: Array<any>) {
    try {
      const req = await fetch(this.rpc.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 67,
          jsonrpc: "2.0",
          method: method,
          params: params,
        }),
      });
      const res = await req.json();
      return res;
    } catch (e) {
      throw new Error("Could not proceed with rpc call");
    }
  }

  async getTokenDecimals(contract: string) {
    try {
      const call = await this.rpcCall("eth_call", [
        {
          data: "0x313ce567add4d438edf58b94ff345d7d38c45b17dfc0f947988d7819dca364f9",
          to: contract,
        },
        "latest",
      ]);
      const decimals = call?.result;
      return parseInt(decimals, 16);
    } catch (e) {
      throw new Error("Something went wrong");
    }
  }

  async getWalletNativeBalance(wallet: string) {
    try {
      wallet = wallet.toLowerCase();
      const call = await this.rpcCall("eth_getBalance", [wallet, "latest"]);
      const balance = parseInt(call?.result, 16) / Math.pow(10, 18);
      const res: BalanceResponse = {
        wallet: wallet,
        balance: balance,
        decimals: 18,
      };
      return res;
    } catch (e) {
      throw new Error("Something went wrong");
    }
  }

  async getWalletTokenBalance(
    wallet: string,
    contract: string,
    decimals?: number
  ) {
    try {
      wallet = wallet.toLowerCase();
      const call = await this.rpcCall("eth_call", [
        {
          data: `0x70a08231000000000000000000000000${wallet.substring(
            2,
            wallet.length
          )}`,
          to: contract,
        },
        "latest",
      ]);
      decimals = decimals ?? (await this.getTokenDecimals(contract));
      const balance = parseInt(call?.result, 16) / Math.pow(10, decimals);
      const res: BalanceResponse = {
        wallet: wallet,
        balance: balance,
        decimals: decimals,
        contract: contract,
      };
      return res;
    } catch (e) {
      throw new Error("Something went wrong");
    }
  }
}
