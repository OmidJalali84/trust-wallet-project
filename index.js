import { abi, contractAddress } from "./usdt-contract.js"

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
                getBalance()
                console.log("Already connected with address:", window.trustwallet.selectedAddress)
            } else {
                // Request account access if needed
                await window.trustwallet.request({ method: "eth_requestAccounts" })
                changeAddress()
                getBalance()
                console.log("Connected to Trust Wallet!", window.trustwallet.selectedAddress)
            }
        } else {
            console.error("Trust Wallet is not installed.")
        }
    } catch (error) {
        console.error("Error connecting to Trust Wallet:", error)
    }
}

console.log(window.trustwallet.selectedAddress)

if (
    window.trustwallet.selectedAddress !== null &&
    window.trustwallet.selectedAddress !== undefined
) {
    changeAddress()
    getBalance()
    console.log("Already connected with address:", window.trustwallet.selectedAddress)
} else {
    const connectButton = document.getElementById("connectButton")
    connectButton.addEventListener("click", () => {
        connectToTrustWallet()
        getBalance()
    })
}

async function getBalance() {
    const tokenContract = await new web3.eth.Contract(abi, contractAddress)
    const balance = await tokenContract.methods
        .balanceOf(window.trustwallet.selectedAddress)
        .call()

    document.getElementById("balance").innerHTML = `your balance is: ${balance} USDT`
}

function changeAddress() {
    document.getElementById("address").innerHTML =
        `You have connected with ${window.trustwallet.selectedAddress}`
}
