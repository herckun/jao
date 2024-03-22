export default class CoingeckoHandler {
    baseUrl: string;
    apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl ?? 'https://api.coingecko.com/api/v3';
        this.apiKey = apiKey;
    }

    async getCoins() {
        try {
            const f = await fetch(`${this.baseUrl}/coins/list`, {
                method: 'GET',
                headers: {
                    'x-cg-demo-api-key': this.apiKey,
                },
            });
            return await f.json();
        } catch (e) {
            return e;
        }
    }
    async getCoinsData(ids: Array<string>) {
        try {
            const f = await fetch(`${this.baseUrl}/coins/markets?ids=${encodeURI(ids.toString())}&vs_currency=usd`, {
                method: 'GET',
                headers: {
                    'x-cg-demo-api-key': this.apiKey,
                },
            });
            return await f.json();
        } catch (e) {
            return e;
        }
    }

    async getPrice(ids: Array<string>) {
        try {
            const f = await fetch(`${this.baseUrl}/simple/price?ids=${encodeURI(ids.toString())}&vs_currencies=usd`, {
                method: 'GET',
                headers: {
                    'x-cg-demo-api-key': this.apiKey,
                },
            });
            return await f.json();
        } catch (e) {
            return e;
        }
    }
}
