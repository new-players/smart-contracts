const { ethers, network } = require("hardhat");
const fs = require("fs").promises;

module.exports = async ({ deployments, getNamedAccounts }) => {
    const existingConfig = JSON.parse(await fs.readFile("config/deployment-config.json", "utf8"));

    const { name, symbol, owner } = existingConfig[network.name].NFT;

    const { deploy, log } = deployments;

    const { deployer } = await getNamedAccounts();

    const args = [name, symbol, owner];

    const NFT = await deploy("NFT", {
        from: deployer,
        args,
        automine: true,
        log: true,
        waitConfirmations: network.config.chainId === 31337 ? 0 : 6
    });

    log(`NFT (${network.name}) deployed to ${NFT.address}`);

    // Verify the contract on Etherscan for networks other than localhost
    if (network.config.chainId !== 31337) {
        await hre.run("verify:verify", {
            address: NFT.address,
            constructorArguments: args,
        });
    }
}

module.exports.tags = ["NFT", "all", "hardhat", "mumbai", "sepolia", "goerli", "fuji", "polygon", "ethereum", "avalanche"];
