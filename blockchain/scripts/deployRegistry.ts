import { ethers } from "hardhat";
import fs from "fs";

async function main() {
    console.log("Deploying contracts...");

    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    // Get balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    // 1. First deploy the MarketplaceRegistry
    const MarketplaceRegistry = await ethers.getContractFactory("MarketplaceRegistry");
    const registry = await MarketplaceRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("MarketplaceRegistry deployed to:", registryAddress);

    // 2. Now deploy NFTFactory with the MarketplaceRegistry address
    const NFTFactory = await ethers.getContractFactory("NFTFactory");
    const nftFactory = await NFTFactory.deploy(registryAddress); // Pass registry address as marketplaceAddress
    await nftFactory.waitForDeployment();
    const nftFactoryAddress = await nftFactory.getAddress();
    console.log("NFTFactory deployed to:", nftFactoryAddress);

    // Save the contract addresses to .env.local
    const envPath = ".env.local";
    let envContent = "";
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");
    }

    // Update or add the contract addresses
    const updates: Record<string, string> = {
        "MARKETPLACE_REGISTRY_CONTRACT_ADDRESS_SAPPHIRE_DEVNET": registryAddress,
        "NEXT_PUBLIC_NFT_FACTORY_ADDRESS": nftFactoryAddress,
        "NEXT_PUBLIC_MARKETPLACE_ADDRESS": registryAddress // Add this if your frontend needs it
    };

    // Process each line in the .env file
    const lines = envContent.split("\n");
    const newLines: string[] = [];

    // Update existing variables
    for (const line of lines) {
        if (line.trim() === "") continue;
        const [key] = line.split("=");
        if (key in updates) {
            newLines.push(`${key}=${updates[key]}`);
            delete updates[key];
        } else {
            newLines.push(line);
        }
    }

    // Add new variables
    for (const [key, value] of Object.entries(updates)) {
        newLines.push(`${key}=${value}`);
    }

    // Write back to .env.local
    fs.writeFileSync(envPath, newLines.join("\n"));

    console.log("\nDeployment Summary:");
    console.log("------------------");
    console.log("MarketplaceRegistry:", registryAddress);
    console.log("NFTFactory:", nftFactoryAddress);
    console.log("\nContract addresses have been saved to .env.local");

    // Optional: Verify the contracts (if you have verification set up)
    // await hre.run("verify:verify", {
    //     address: registryAddress,
    //     constructorArguments: [],
    // });
    // await hre.run("verify:verify", {
    //     address: nftFactoryAddress,
    //     constructorArguments: [registryAddress],
    // });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });