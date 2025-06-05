import { ethers } from "ethers";

export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  name: string;
  explorerUrl?: string;
  supportedChainIds?: number[];
}

export const NETWORKS: Record<string, NetworkConfig> = {
  hardhat: {
    chainId: 1337,
    rpcUrl: "http://localhost:8545",
    name: "Hardhat",
    explorerUrl: "http://localhost:8545",
    supportedChainIds: [1337, 31337], // Supporting both hardhat and localhost chain IDs
  },
  sapphireDevnet: {
    chainId: 0x5aff,
    rpcUrl: "https://testnet.sapphire.oasis.dev",
    name: "Sapphire Devnet",
    explorerUrl: "https://explorer.oasis.io/devnet/sapphire",
  },
};

export function getNetworkConfig(networkName: string): NetworkConfig {
  const config = NETWORKS[networkName];
  if (!config) {
    throw new Error(`Network ${networkName} not found in configuration`);
  }
  return config;
}

export function createProvider(networkName: string): ethers.JsonRpcProvider {
  const config = getNetworkConfig(networkName);
  return new ethers.JsonRpcProvider(config.rpcUrl, {
    chainId: config.chainId,
    name: config.name,
  });
}

export async function verifyNetworkConnection(provider: ethers.JsonRpcProvider, networkName: string): Promise<void> {
  try {
    const network = await provider.getNetwork();
    const config = getNetworkConfig(networkName);

    // Convert chain IDs to BigInt for comparison
    const currentChainId = network.chainId;
    const expectedChainId = BigInt(config.chainId);
    const supportedChainIds = config.supportedChainIds?.map((id) => BigInt(id)) || [];

    const isSupportedChainId =
      supportedChainIds.length > 0 ? supportedChainIds.includes(currentChainId) : currentChainId === expectedChainId;

    if (!isSupportedChainId) {
      throw new Error(
        `Network chain ID mismatch. Expected ${config.chainId} or one of ${config.supportedChainIds?.join(", ")}, got ${currentChainId.toString()}`
      );
    }

    console.log(`Connected to ${network.name} (Chain ID: ${currentChainId.toString()})`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("chain ID")) {
        throw error;
      }
      throw new Error(`Failed to connect to network: ${error.message}`);
    }
    throw new Error("Failed to connect to network: Unknown error");
  }
}
