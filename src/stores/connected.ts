import { atom } from "nanostores";

export const connected = atom<{
  address: string | null;
}>({
  address: null,
});
