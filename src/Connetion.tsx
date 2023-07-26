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

    
    getUserTransactionData = async () => {
        const { web3, account }:any = this.state;
        if (!web3 || !account) return;
      
        try {
          // Get the latest block number to fetch the latest transaction
          const latestBlock = await web3.eth.getBlockNumber();
          const latestBlockData = await web3.eth.getBlock(latestBlock);
      
          // Check if there are any transactions in the latest block
          if (latestBlockData.transactions.length > 0) {
            // Fetch the latest transaction details
            const latestTransactionHash :any= latestBlockData.transactions[0];
            const latestTransaction = await web3.eth.getTransaction(latestTransactionHash);
      
            console.log("Latest Transaction:", latestTransaction);
            console.log("Gas Limit:", latestTransaction.gas);
            console.log("Amount (Value):", latestTransaction.value);
            console.log("Nonce:", latestTransaction.nonce);
            // Other transaction details can be accessed similarly
          } else {
            console.log("No transactions in the latest block.");
          }
        } catch (error) {
          console.error("Error fetching latest transaction:", error);
        }
      };
    
    

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

    

    fetchTransactionHistory = async () => {
        const { web3, account }: any = this.state;
        if (!web3) return;

        try {
            const contract = new web3.eth.Contract(
                ERC20TokenABI,
                ERC20TokenContractAddress
            );
            const events = await contract.getPastEvents("Transfer", {
                filter: { from: account },
                fromBlock: 0,
                toBlock: "latest",
            });
            console.log("Transaction History:", events);
            this.setState({ transactions: events });
        } catch (error) {
            console.error("Error fetching transaction history:", error);
        }
    };

    

    

    render() {
        const { account, transactions }: any = this.state;
        return (
            <div>
                <h2>Connected Account: {account}</h2>
                <h3>Transaction History:</h3>
                <button onClick={this.fetchTransactionHistory}>Fetch History</button>
                <button onClick={this.fetchEtherBalance}>Fetch Ether Balance</button>
                <button onClick={this.getUserTransactionData}>getUserTransactionData</button>
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

