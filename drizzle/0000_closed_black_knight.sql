CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial NOT NULL,
	"wallet" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "accounts_wallet_unique" UNIQUE("wallet")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "balances" (
	"id" serial NOT NULL,
	"balance" varchar,
	"account_wallet" varchar,
	"token_contract" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "balances_account_wallet_token_contract_pk" PRIMARY KEY("account_wallet","token_contract")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chains" (
	"id" serial NOT NULL,
	"name" varchar,
	"chain_id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"native_symbol" varchar,
	"icon_uri" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" serial NOT NULL,
	"name" varchar,
	"chain_id" integer DEFAULT 1,
	"contract" varchar PRIMARY KEY NOT NULL,
	"decimals" integer,
	"coingecko_id" varchar,
	"icon_uri" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tokens_contract_unique" UNIQUE("contract")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "balances" ADD CONSTRAINT "balances_account_wallet_accounts_wallet_fk" FOREIGN KEY ("account_wallet") REFERENCES "accounts"("wallet") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "balances" ADD CONSTRAINT "balances_token_contract_tokens_contract_fk" FOREIGN KEY ("token_contract") REFERENCES "tokens"("contract") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
