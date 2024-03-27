import { coinbaseWallet, walletConnect } from "@wagmi/connectors";
import { http, createConfig, injected } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";

export const projectId = "2f95c7b370fe8d6e8e5def9e3bc36c69";
export const metadata = {
  name: "jao.",
  description: "just an overview",
  url: "https://jao-astroport.pages.dev/", // origin must match your domain & subdomain
  icons: ["https://jao-astroport.pages.dev/favicon.jpg"],
};
export const config = createConfig({
  chains: [mainnet],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
  ],
});
