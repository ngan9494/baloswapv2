import { Box, Flex } from "@radix-ui/themes";
import From from "./From";
import To from "./To";
import SwapButton from "./SwapButton";
import { useEffect, useState } from "react";
import { Aptos, MoveStructId, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
// import { atom, useAtomValue, useSetAtom, useAtom } from "jotai";
// import type { PrimitiveAtom } from "jotai";

export default function SwapBox({ notifySuccess, notifyFailure }) {
    // with custom configuration
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    // console.log(aptos)

    const { account } = useWallet()

    type Token = {
        symbol: String,
        address: MoveStructId,
        logoURI: String,
        rate: Number,
        swapTokens: Array<String>
    }

    async function getResourceAmount(address) {
        try{
            const resource = await aptos.getAccountResource({
                accountAddress: account.address,
                resourceType: `0x1::coin::CoinStore<${address}>`,
            });
        
            if (resource) {
                const value = resource.coin.value / 100000000
                return value
            } else {
                // console.log("Token not found")
                return 0
            }
        } catch (error) {
            // console.error("Error fetching token details:", error);
            return 0
        }
    }

    const tokens: Array<Token> = [
        {
            symbol: "CAKE",
            address: "0xe0e5ad285cbcdb873b2ee15bb6bcac73d9d763bcb58395e894255eeecf3992cf::pancake::Cake",
            logoURI: "https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png?1696512440",
            rate: 0.00014254,
            swapTokens: ["APT"]
        },
        {
            symbol: "tAPTS",
            address: "0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::TestToken",
            logoURI: "https://testnet.aptoswap.net/images/token/aptoswap-test.svg",
            rate: 259.57985345,
            swapTokens: ["APT"]
        },
        {
            symbol: "MOVE",
            address: "0xe4497a32bf4a9fd5601b27661aa0b933a923191bf403bd08669ab2468d43b379::move_coin::MoveCoin",
            logoURI: "https://testnet.aptoswap.net/images/token/move.svg",
            rate: 0.11952998,
            swapTokens: ["APT"]
        },
        {
            symbol: "APT",
            address: "0x1::aptos_coin::AptosCoin",
            logoURI: "https://testnet.aptoswap.net/images/token/aptos.svg",
            rate: 1.00000000,
            swapTokens: ["APT", "USDC", "USDT", "BTC", "DAI", "tAPT", "tAPTS", "MOVE", "CAKE"]
        },
        {
            symbol: "BTC",
            address: "0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetBTC",
            logoURI: "https://testnet.aptoswap.net/images/token/btc.svg",
            rate: 13.1058147,
            swapTokens: ["APT", "USDC", "USDT"]
        },
        {
            symbol: "DAI",
            address: "0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetDAI",
            logoURI: "https://testnet.aptoswap.net/images/token/dai.svg",
            rate: 59.15573208,
            swapTokens: ["APT", "BTC"]
        },
        {
            symbol: "USDC",
            address: "0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetUSDC",
            logoURI: "https://testnet.aptoswap.net/images/token/usdc.svg",
            rate: 42615.78608186,
            swapTokens: ["APT", "BTC"]
        },
        {
            symbol: "USDT",
            address: "0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetUSDT",
            logoURI: "https://testnet.aptoswap.net/images/token/usdt.svg",
            rate: 32609.74569337,
            swapTokens: ["APT", "BTC"]
        },
        {
            symbol: "tAPT",
            address: "0x2a2ad97dfdbe4e34cdc9321c63592dda455f18bc25c9bb1f28260312159eae27::staked_aptos_coin::StakedAptosCoin",
            logoURI: "https://testnet.aptoswap.net/images/token/tAPT.svg",
            rate: 0.01600119,
            swapTokens: ["APT"]
        },
    ]

    // const xTokens = atom([])
    // const yTokens = atom([])
    // const fromToken = atom<PrimitiveAtom<Token | null>>(null)
    // const toToken = atom<PrimitiveAtom<Token | null>>(null)
    // const swapAmount = atom(0)
    // const convertedAmount = atom(0)
    // const fromTokenAmount = atom(0)
    // const toTokenAmount = atom(0)

    const [xTokens, setXTokens] = useState([])
    const [yTokens, setYTokens] = useState([])
    const [fromToken, setFromToken] = useState<Token | null>(null)
    const [toToken, setToToken] = useState<Token | null>(null)
    const [swapAmount, setSwapAmount] = useState(0)
    const [convertedAmount, setConvertedAmount] = useState(0)
    const [fromTokenAmount, setFromTokenAmount] = useState(0)
    const [toTokenAmount, setToTokenAmount] = useState(0)

    const handleSetXTokens = () => {
        // const setAtom = useSetAtom(xTokens)
        // setAtom(tokens)
        setXTokens(tokens)
        // console.log("xTokens: ", xTokens)
    }
    const handleSetYTokens = () => {
        const ytoks = []
        for (const token of tokens) {
            for (const swapToken in fromToken.swapTokens) {
                if (fromToken.swapTokens[swapToken] === token.symbol) {
                    ytoks.push(token)
                }
            }
        }
        handleSetToToken(null)
        handleSetConvertedAmount()
        setYTokens(ytoks)
        // console.log(fromToken.symbol, " : ", yTokens)
    }
    const handleSetFromToken = (token) => {
        // const [, setAtom] = useAtom(fromToken)
        // setAtom((token) => ({...token}))
        setFromToken(token)
        // console.log("fromToken: ", fromToken)
    }
    const handleSetToToken = (token) => {
        setToToken(token)
        handleSetConvertedAmount()
        // console.log("toToken: ", toToken)
    }
    const handleSetSwapAmount = (amt) => {
        setSwapAmount(amt)
        // console.log("swapAmount: ", swapAmount)
    }
    const handleSetConvertedAmount = () => {
        const amt = swapAmount * (1 / Number(fromToken?.rate)) * Number(toToken?.rate)
        setConvertedAmount(amt)
        // console.log("convertedAmount: ", convertedAmount)
    }
    const handleSetFromTokenAmount = (value) => {
        setFromTokenAmount(value)
    }
    const handleSetToTokenAmount = (value) => {
        setToTokenAmount(value)
    }

    useEffect(() => {
        handleSetXTokens()
    }, [])

    return (
        <Box
            p="3"
            m="3"
            style={{ backgroundColor: 'var(--gray-a2)', borderRadius: 'var(--radius-3)' }}
        >
            <Flex gap="7" direction="column" align="center">
                <From tokens={xTokens} handleSetYTokens={handleSetYTokens} fromToken={fromToken} handleSetFromToken={handleSetFromToken} handleSetSwapAmount={handleSetSwapAmount} handleSetConvertedAmount={handleSetConvertedAmount} getResourceAmount={getResourceAmount} fromTokenAmount={fromTokenAmount} handleSetFromTokenAmount={handleSetFromTokenAmount} />
                <hr />
                <To tokens={yTokens} toToken={toToken} fromToken={fromToken} swapAmount={swapAmount} convertedAmount={convertedAmount} handleSetConvertedAmount={handleSetConvertedAmount} handleSetToToken={handleSetToToken} getResourceAmount={getResourceAmount} toTokenAmount={toTokenAmount} handleSetToTokenAmount={handleSetToTokenAmount} />
                <SwapButton aptos={aptos} swapAmount={swapAmount} convertedAmount={convertedAmount} fromToken={fromToken} toToken={toToken} notifySuccess={notifySuccess} notifyFailure={notifyFailure} getResourceAmount={getResourceAmount} handleSetToTokenAmount={handleSetToTokenAmount} handleSetFromTokenAmount={handleSetFromTokenAmount} />
            </Flex>
        </Box>
    )
}