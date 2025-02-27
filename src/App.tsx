import AppBar from "./components/AppBar";
import SwapBox from "./components/SwapBox";
import { Flex } from "@radix-ui/themes";
import ConnectWalletNotice from "./components/ConnectWalletNotice";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {
    connected,
  } = useWallet();

  const notifySuccess = () => toast.success("Transaction successful")
  const notifyFailure = () => toast.error("Transaction failed. Try a different token")

  return (
    <Flex gap="3" direction="column" justify="between">
      <AppBar />
      {
        connected
        ? <SwapBox notifySuccess={notifySuccess} notifyFailure={notifyFailure} />
        : <ConnectWalletNotice />
      }
      <ToastContainer theme="dark" position="bottom-right" />
    </Flex>
  )
}

export default App
