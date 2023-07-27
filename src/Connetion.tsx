import React, { Component } from "react";
import Web3 from "web3";

const ERC20TokenContractAddress = ""; // Replace this with the ERC20 token contract address

// Replace this with the actual ABI for your ERC20 token contract
const ERC20TokenABI: any[] = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    // Add more functions and events if required for your contract...
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
];

class Connection extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
            web3: null,
            account: "",
            transactions: [],
        };
    }

    componentDidMount() {
        this.initializeMetaMask();
    }

    initializeMetaMask = async () => {
        try {
            if (typeof (window as any).ethereum !== "undefined") {
                await (window as any).ethereum.request({
                    method: "eth_requestAccounts",
                });
                const web3 = new Web3((window as any).ethereum);
                const accounts = await web3.eth.getAccounts();
                this.setState({ web3, account: accounts[0] });
            } else {
                console.log(
                    "Please install MetaMask or use a compatible Ethereum browser."
                );
            }
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
    };



    fetchEtherBalance = async () => {
        const { web3, account }: any = this.state;
        if (!web3) return;

        try {
            const balance = await web3.eth.getBalance(account);
            console.log("Ether Balance:", web3.utils.fromWei(balance, "ether"));
            // You can set the balance in the state and display it in the render method if needed.
        } catch (error) {
            console.error("Error fetching Ether balance:", error);
        }
    };

    getTransaction = async (txHash: string) => {
        const { web3 }: any = this.state;
        console.log('Web 3', web3);
        if (!web3) return;
        try {
            const transaction = await web3.eth.getTransaction(txHash);
            console.log("Transaction:", transaction);
            console.log("From:", transaction.from);
            console.log("To:", transaction.to);
            console.log("Nonce:", transaction.nonce);
            const valueInEther = web3.utils.fromWei(transaction.value, "ether");
            console.log("Amount (Ether):", valueInEther);
            console.log("Gas Limit (Units):", transaction.gas);
            console.log("Gas Used (Units):", transaction.gasUsed);
            const gasPriceInGwei = web3.utils.fromWei(transaction.gasPrice, "ether");
            console.log("Base fee (Gwei):", gasPriceInGwei);
            console.log("Priority fee (Gwei):", transaction.maxPriorityFeePerGas);
            console.log("Total gas fee (MATIC):", transaction.gasFee);
            console.log("Max fee per gas (MATIC):", transaction.maxFeePerGas);
            console.log("Max fee per gas (USD):", transaction.maxFeePerGasUSD);

           
            const gasPriceWei = await web3.eth.getGasPrice();
             console.log('gasPriceGwei22',gasPriceWei)
            // Convert gas price to Gwei (1 Gwei = 1e9 Wei)
            const gasPriceGwei = web3.utils.fromWei(gasPriceWei, 'Gwei');
            console.log('gasPriceGwei22',gasPriceGwei)

        } catch (error) {
            console.error("Error fetching transaction:", error);
        }
    };
    
    getTransactionStatus = async (txHash: string) => {
        // Check if MetaMask is available
        if (!(window as any).ethereum) {
          console.error("MetaMask is not available.");
          return;
        }
    
        try {
          // Request access to the user's MetaMask account
          await (window as any).ethereum.enable();
    
          // Get the transaction status
          const receipt = await (window as any).ethereum.request({
            method: "eth_getTransactionReceipt",
            params: [txHash],
          });
    
          if (receipt && receipt.status) {
            console.log("Transaction Status: Success");
          } else if (receipt && !receipt.status) {
            console.log("Transaction Status: Failed");
          } else {
            console.log("Transaction Status: Pending or Transaction Not Found");
          }
        } catch (error) {
          console.error("Error fetching data from MetaMask:", error);
        }
      };

      
      
    
    

    render() {
        const { account, transactions }: any = this.state;
        return (
            <div>
                <h2>Connected Account: {account}</h2>
                <h3>Transaction History:</h3>
                <button onClick={this.fetchEtherBalance}>Fetch Ether Balance</button>
                <button onClick={() => this.getTransaction("0x3ae5b58e983a74505fd21e93261f45db0d91a1712285a2a950d0e8c19ff21dc3")}>
                    getTransaction
                </button>
                <button onClick={()=>this.getTransactionStatus("0x3ae5b58e983a74505fd21e93261f45db0d91a1712285a2a950d0e8c19ff21dc3")}>getTransactionStatus</button>
                <ul>
                    {transactions.map((transaction: any, index: any) => (
                        <li key={index}>
                            <strong>Transaction Hash:</strong> {transaction.transactionHash}<br />
                            <strong>From:</strong> {transaction.returnValues.from}<br />
                            <strong>To:</strong> {transaction.returnValues.to}<br />
                            <strong>Amount:</strong> {transaction.returnValues.value}<br />
                            <strong>Block Number:</strong> {transaction.blockNumber}<br />
                            <strong>Transaction Index:</strong> {transaction.transactionIndex}<br />
                            {/* Add more details as needed */}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Connection;

