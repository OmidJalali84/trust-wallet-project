//0x994AC9D988ef1718b5930F658F9eCf439Ea4Bc91
//0xd64CDF9aa4E0EBc80236b486226ED711B3E961a4

import { abi, contractAddress } from "./usdt-contract.js"
//import { Web3 } from "web3"
import { ethers } from "./ethers.js"
//import Web3 from "https://cdn.esm.sh/v58/web3@1.6.1/es2021/web3.js"

const web3 = new Web3(window.trustwallet)

async function connectToTrustWallet() {
    try {
        // Check if Web3 has been injected by Trust Wallet or any other provider
        if (typeof window.trustwallet !== "undefined") {
            // Check if already connected
            if (
                window.trustwallet.selectedAddress !== null &&
                window.trustwallet.selectedAddress !== undefined
            ) {
                changeAddress()
                console.log("Already connected with address:", window.trustwallet.selectedAddress)
            } else {
                // Request account access if needed
                await window.trustwallet.request({ method: "eth_requestAccounts" })
                changeAddress()
                console.log("Connected to Trust Wallet!", window.trustwallet.selectedAddress)
            }
        } else {
            console.error("Trust Wallet is not installed.")
        }
    } catch (error) {
        console.error("Error connecting to Trust Wallet:", error)
    }
}

async function getBalance() {
    //console.log(window.trustwallet.selectedAddress)
    // const contract = new ethers.Contract(contractAddress, abi, )
    // const balance = contract.balanceOf(window.trustwallet.selectedAddress)
    const tokenContract = await new web3.eth.Contract(abi, contractAddress)
    const balance = await tokenContract.methods
        .balanceOf(window.trustwallet.selectedAddress)
        .call()

    document.getElementById("balance").innerHTML = `your balance is: ${balance}`
}

function changeAddress() {
    document.getElementById("address").innerHTML =
        `You have connected with ${window.trustwallet.selectedAddress}`
}

const connectButton = document.getElementById("connectButton")
connectButton.addEventListener("click", () => {
    connectToTrustWallet()
    getBalance()
})
