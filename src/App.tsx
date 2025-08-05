import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
    amIManager,
    checkIfPlayerInGame,
    getContractBalance,
    getUserBalance,
    publicClient,
    readContract,
    writeContract
} from "./web3.tsx";
import {parseEther} from "viem";

// 0x5e2f5363e8962AFbD6D0063D389a19031c75A307

function App() {
    const [count, setCount] = useState(0);
    const [playerCount, setPlayerCount] = useState(0n);
    const [isManager, setIsManager] = useState(false)
    const [balance, setBalance] = useState("0");
    const [loader, setLoader] = useState(false);
    const [contractBalance, setContractBalance] = useState("0");
    const [isPlayerInGame, setIsPlayerInGame] = useState(false);


    useEffect(() => {
        readContract('getPlayerNumber').then(numberOfPlayers => {
            setPlayerCount(numberOfPlayers as bigint)
        })
        checkIfPlayerInGame().then(isInGame => {
            setIsPlayerInGame(isInGame);
        })
        getUserBalance().then(balance => {
            setBalance(balance);
        })
        getContractBalance().then(contractBalance => {
            setContractBalance(contractBalance);
        })
        amIManager().then(isManager => {
            setIsManager(isManager);
        })
    }, []);

    const pickAWinner = async () => {
        try {
            const hash = await writeContract('pickWinner');

            console.log("Transaction sent:", hash);

            setLoader(true);

            const receipt = await publicClient.waitForTransactionReceipt({hash});

            console.log("Transaction confirmed:", receipt);

            if (receipt.status === 'reverted') {
                return
            }

            getUserBalance().then(balance => {
                setBalance(balance);
            });

            checkIfPlayerInGame().then(isInGame => {
                setIsPlayerInGame(isInGame);
            })

            getContractBalance().then(contractBalance => {
                setContractBalance(contractBalance);
            })

        } catch (error) {
            console.error("Error picking a winner:", error);
        } finally {
            setLoader(false);
        }
    }

    const joinGame = async () => {
        try {
            // Відправляємо транзакцію
            const hash = await writeContract('enterTheGame', [], parseEther("0.001"));

            console.log("Transaction sent:", hash);

            setLoader(true);
            // Чекаємо підтвердження
            const receipt = await publicClient.waitForTransactionReceipt({hash});

            console.log("Transaction confirmed:", receipt);

            if (receipt.status === 'reverted') {
                return
            }

            // Оновлюємо стан після успішної транзакції
            setPlayerCount(playerCount + 1n);

            getUserBalance().then(balance => {
                setBalance(balance);
            });


            getContractBalance().then(contractBalance => {
                setContractBalance(contractBalance);
            })

        } catch (error) {
            console.error("Error joining game:", error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <h2>Manager: {isManager ? "Yes" : "No"}</h2>
            {isManager && (
                <div className="card">
                    <button onClick={() => pickAWinner()}>
                        Pick a winner
                    </button>
                </div>
            )}
            {loader && (
                <div style={{marginTop: "20px", color: "blue", fontWeight: "bold"}}>
                    Processing transaction... Please wait.
                </div>
            )}
            <div className="card">
                <button onClick={() => setCount((count) => {
                    return count + 1;
                })}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <div className="card">
                {isPlayerInGame && (<p>You are in the game!</p>)}
                {!isPlayerInGame && !loader && (<button onClick={() => joinGame()}>
                    Join for 0.001 eth to compete with {playerCount}
                </button>)
                }
                <p>
                    your balance is {balance} ETH
                </p>
                <p>
                    the competition balance is {contractBalance} ETH
                </p>

            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
