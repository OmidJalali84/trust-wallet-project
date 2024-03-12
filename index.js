import { abi, contractAddress } from "./usdt-contract.js"

const web3 = new Web3(window.trustwallet)

//button varibales
const connectButton = document.getElementById("connectButton")
const addressP = document.getElementById("address")
const balanceP = document.getElementById("balance")
setData()

async function connectToTrustWallet() {
    try {
        // Check if Web3 has been injected by Trust Wallet or not
        if (typeof window.trustwallet !== "undefined") {
            // Check if already connected
            if (connectButton.innerHTML == "Connected") {
                console.log("Already connected with address:", window.trustwallet.selectedAddress)
                getAddress()
                getBalance()
            } else {
                // Request account access if needed
                await window.trustwallet.request({ method: "eth_requestAccounts" })
                console.log("Connected to Trust Wallet!", window.trustwallet.selectedAddress)
                localStorage.setItem("connect", "Connected")
                getAddress()
                getBalance()
            }
        } else {
            console.error("Trust Wallet is not installed.")
        }
    } catch (error) {
        console.error("Error connecting to Trust Wallet:", error)
    }
}
//this function gets the balance of our wallet address
async function getBalance() {
    const tokenContract = await new web3.eth.Contract(abi, contractAddress)
    const balance = await tokenContract.methods
        .balanceOf(window.trustwallet.selectedAddress)
        .call()

    localStorage.setItem("balance", `your balance is: ${balance} USDT`) //stores the data of element
    setData()
}

function getAddress() {
    localStorage.setItem(
        "address",
        `You have connected with ${window.trustwallet.selectedAddress}`, //stores the data of element
    )
    setData()
}

//sets the data into elements
function setData() {
    addressP.innerHTML = localStorage.getItem("address")
    balanceP.innerHTML = localStorage.getItem("balance")
    connectButton.innerHTML = localStorage.getItem("connect")
}

connectButton.addEventListener("click", () => {
    connectToTrustWallet()
})

//this part is used when the user disconnects the wallet
window.onerror = function (message, source, lineno, colno, error) {
    console.log(message)
    if (message == "Uncaught TypeError: this.provider.disconnect is not a function") {
        localStorage.setItem("connect", "Connect to Trust Wallet")
        localStorage.setItem("address", "")
        localStorage.setItem("balance", "")
        setData()
    }
}
