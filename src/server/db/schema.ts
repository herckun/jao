import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  bigint,
  primaryKey,
} from "drizzle-orm/pg-core";

export const Token = pgTable("tokens", {
  id: serial("id"),
  name: varchar("name"),
  chainId: integer("chain_id").default(1),
  contract: varchar("contract").unique().primaryKey(),
  decimals: integer("decimals"),
  coingeckoId: varchar("coingecko_id"),
  iconURI: varchar("icon_uri"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const Chain = pgTable("chains", {
  id: serial("id"),
  name: varchar("name"),
  chainId: integer("chain_id").default(1).primaryKey(),
  nativeSymbol: varchar("native_symbol"),
  iconURI: varchar("icon_uri"),
});

export const Balance = pgTable(
  "balances",
  {
    id: serial("id"),
    balance: varchar("balance"),
    account_wallet: varchar("account_wallet").references(() => Account.wallet),
    token_contract: varchar("token_contract").references(() => Token.contract),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.account_wallet, table.token_contract] }),
    };
  }
);

export const Account = pgTable("accounts", {
  id: serial("id"),
  wallet: varchar("wallet").unique().primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
