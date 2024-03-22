import db from "../database";
import { Account } from "../schema";

const seed_accounts = async () => {
  await db
    .insert(Account)
    .values({
      wallet: "0xe61bb41d806a63f41402d91b67ba08638941987e",
    })
    .onConflictDoNothing();
};
export default seed_accounts;
