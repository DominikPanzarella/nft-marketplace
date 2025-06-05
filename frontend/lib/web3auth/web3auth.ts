import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155, // Usa l'enum corretto
  chainId: "0x539", // 1337 in esadecimale (Hardhat default)
  rpcTarget: "http://localhost:8545",
  displayName: "Hardhat Localhost",
  blockExplorer: "", // Nome corretto della proprietà
  ticker: "ETH",
  tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "",
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider, // Aggiunto il provider mancante
  chainConfig,
  loginConfig: {
    google: {
      verifier: "google-verifier-blockchain",
      typeOfLogin: "google",
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },
};

const web3auth = new Web3Auth(web3AuthOptions);

export const isAuthenticated = () => {
  return web3auth.connected;
};

export const setAuthenticated = (authenticated: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("web3auth_connected", authenticated ? "true" : "false");
};

// Handle login
export const handleLogin = async () => {
  if (!web3auth) return;
  try {
    console.log("Initializing Web3Auth modal...");
    await web3auth.initModal();
    console.log("Attempting to connect...");
    const provider = await web3auth.connect();
    console.log("Connection successful, setting authenticated state");
    setAuthenticated(true);
    return provider;
  } catch (error) {
    console.error("Login error:", error);
    setAuthenticated(false);
    throw error;
  }
};

// Handle logout
export const handleLogout = async () => {
  try {
    await web3auth.logout();
    setAuthenticated(false);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export { web3auth };
