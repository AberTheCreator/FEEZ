const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log(`Deploying FeezNFT to ${hre.network.name}...`);

  const [deployer] = await hre.ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);

  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

  const FeezNFT = await hre.ethers.getContractFactory("FeezNFT");
  const feezNFT = await FeezNFT.deploy(
    "Feez Demo NFT",
    "FEEZ",
    "https://api.feez.app/metadata/"
  );

  await feezNFT.waitForDeployment();
  const address = await feezNFT.getAddress();
  console.log("Contract deployed at:", address);

  if (hre.network.name === "base-sepolia") {
    console.log("Waiting for confirmations...");
    await feezNFT.deploymentTransaction().wait(5);

    try {
      await hre.run("verify:verify", {
        address,
        constructorArguments: [
          "Feez Demo NFT",
          "FEEZ",
          "https://api.feez.app/metadata/"
        ],
      });
      console.log("Verified on BaseScan");
    } catch (err) {
      console.error("Verification failed:", err);
    }
  }

  const info = {
    network: hre.network.name,
    address,
    deployer: deployer.address,
    txHash: feezNFT.deploymentTransaction().hash,
    time: new Date().toISOString()
  };

  if (!fs.existsSync("deployments")) fs.mkdirSync("deployments");
  fs.writeFileSync(
    path.join("deployments", `${hre.network.name}.json`),
    JSON.stringify(info, null, 2)
  );

  console.log("\nDeployment saved.");
  console.log(`NEXT_PUBLIC_FEEZ_NFT_CONTRACT_ADDRESS=${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
