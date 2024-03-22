type IToken = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

type TokenListResponse = {
  tokens: Array<IToken>;
};

export default class TokenListHandler {
  apiEndPoint: string;

  constructor(apiEndPoint?: string) {
    this.apiEndPoint =
      apiEndPoint ?? "https://gateway.ipfs.io/ipns/tokens.uniswap.org";
  }

  async getTokens() {
    try {
      const req = await fetch(`${this.apiEndPoint}`);
      const json = await req.json();

      if (req.status !== 200 || json.tokens === undefined) {
        throw new Error("Request failed");
      }

      const res: TokenListResponse = {
        tokens: json.tokens as IToken[],
      };
      return res;
    } catch (e) {
      throw new Error("Error fetching tokens");
    }
  }
}
