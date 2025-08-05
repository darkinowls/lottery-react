import {createPublicClient, createWalletClient, custom, formatEther, http} from 'viem';
import {sepolia} from 'viem/chains';


declare global {
    interface Window {
        ethereum: never;
    }
}

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

export const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
});


export const getUserBalance = async () => {
    const [account] = await walletClient.requestAddresses();
    const balance = await publicClient.getBalance({address: account});
    return formatEther(balance); // повертає string у ETH
};

export const getContractBalance = async () => {
    const balance = await publicClient.getBalance({address});
    return formatEther(balance); // у ETH
};

export const checkIfPlayerInGame = async () => {
    return (await readContract('isPlayerInside') as boolean)
}


export const amIManager = async () => {
    const [account] = await walletClient.requestAddresses();
    const manager = await readContract('manager');
    return account === manager;
}

// Виклик read-only функції контракту
export const readContract = async (functionName: string, args: object[] = []) => {
    const [account] = await walletClient.requestAddresses();
    return publicClient.readContract({
        address,
        abi,
        functionName,
        args,
        account
    });
};

// Запис у контракт (write)
export const writeContract = async (
    functionName: string,
    args: object[] = [],
    value: bigint = 0n
) => {
    const [account] = await walletClient.requestAddresses();
    return walletClient.writeContract({
        address,
        abi,
        functionName,
        args,
        value,
        account
    });
};

const address = import.meta.env.VITE_CONTRACT_ADDRESS!

const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "currentGameId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "enterTheGame",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllPlayers",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPlayerNumber",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRandom",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "inGame",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "name": "isPlayerInGame",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isPlayerInside",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "manager",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pickWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "players",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
