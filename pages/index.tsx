import React, { useState } from 'react';
import Modal from '../components/modal';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { abi } from '../contract-abi';
import type {
  UsePrepareContractWriteConfig,
  UseContractReadConfig,
  UseContractWriteConfig,
} from 'wagmi';

const contractConfig = {
  address: '0x50c7a80B329963f89480661c5F13Bb3ab6F78129',
  abi,
};

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [totalMinted, setTotalMinted] = React.useState(0);
  const { isConnected } = useAccount();

  const [numTokens, setNumTokens] = React.useState(1);
  const mintPrice = 0.005;

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'mint',
    args: [numTokens],
  } as UsePrepareContractWriteConfig);

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(contractWriteConfig as UseContractWriteConfig);

  const { data: totalSupplyData }: any = useContractRead({
    ...contractConfig,
    functionName: 'totalSupply',
    watch: true,
  } as UseContractReadConfig);

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);

  const isMinted = txSuccess;

  const [whatModalOpen, setWhatModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [burnModalOpen, setBurnModalOpen] = useState(false);
  
  const handleWhatClick = () => {
    setWhatModalOpen(true);
  };
  
  const handleWhatClose = () => {
    setWhatModalOpen(false);
  };
  
  const handleFaqClick = () => {
    setFaqModalOpen(true);
  };
  
  const handleFaqClose = () => {
    setFaqModalOpen(false);
  };
  
  const handleBurnClick = () => {
    setBurnModalOpen(true);
  };
  
  const handleBurnClose = () => {
    setBurnModalOpen(false);
  };

  return (
    <div className="page" style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
      <h1>POLYGONS ONCHAIN</h1>
      <h2>Polygons Onchain is a generative art project. Polygons are uniquely generated at time of mint, the art code & image generated and stored entirely onchain.</h2>
      <p className="generated" >{totalMinted} generated.</p>
      <ConnectButton style={{ margin: "1rem 0" }} />
      { isConnected && (  
      <div style={{ margin: "2rem 0" }}>
        <button className="numbutton" onClick={() => setNumTokens(Math.max(1, numTokens - 1))}>-</button>
        <span className="mintnumber" style={{ margin: "0 1rem" }}>{numTokens}</span>
        <button className="numbutton" onClick={() => setNumTokens(Math.min(10, numTokens + 1))}>+</button>
      </div>
      )}
      { isConnected && ( 
      <p style={{ margin: "0.5rem 0" }}>{(numTokens * 0.005).toFixed(3)} ETH</p>
      )}
      { isConnected && ( 
      <button
        style={{ marginTop: "1rem" }}
        disabled={!mint || isMintLoading || isMintStarted}
        className="button"
        data-mint-loading={isMintLoading}
        data-mint-started={isMintStarted}
        onClick={() => mint?.(numTokens)}
      >
        {isMintLoading && "Waiting for approval"}
        {isMintStarted && "Minting..."}
        {!isMintLoading && !isMintStarted && "GENERATE"}
      </button>
      )}
      {mintError && (
        <p style={{ marginTop: "1rem", color: "#FF6257" }}>
          Error: {mintError.message}
        </p>
      )}
      {txError && (
        <p style={{ marginTop: "1rem", color: "#FF6257" }}>
          Error: {txError.message}
        </p>
      )}
      {isMinted && (
        <div style={{ margin: "1rem 0" }}>
          <p>
            View on{" "}
            <a href={`https://rinkeby.etherscan.io/tx/${mintData?.hash}`}>
              Etherscan
            </a>
          </p>
          <p>
            View on{" "}
            <a
              href={`https://testnets.opensea.io/assets/rinkeby/${txData?.to}/1`}
            >
              Opensea
            </a>
          </p>
        </div>
        
      )}
      <footer>
      <div className="footer">
    <nav>
      <ul>
        <li><a href="#" className="menu-item" onClick={handleWhatClick}>1) What</a></li>
        <li><a href="#" className="menu-item" onClick={handleFaqClick}>FAQ</a></li>
        <li><a href="#" className="menu-item" onClick={handleBurnClick}>Burn</a></li>
      </ul>
    </nav>
    <Modal
  title='What Modal'
  isOpen={whatModalOpen}
  onClose={handleWhatClose}
>
  <p className="modalHeader">This is a header.</p>
  <p>Polygon Onchain is built by pcdkd. Connect on farcaster, nostr, and bird app. View the code for the mint app here. View the erc721 contract here. The contract owner cannot mint more than 10 Polygons.</p>
</Modal>

<Modal
  title='FAQ Modal'
  isOpen={faqModalOpen}
  onClose={handleFaqClose}
>
<p className="modalHeader">What is Polygons Onchain?</p>
<p className="modalText">A generative, onchain art project on Ethereum. Read more on 1) What.</p>
<hr className="modalDivide"></hr>
<p className="modalHeader">Where do I generate Polygons?</p>
<p className="modalText">Polygons can only be generated on <a href="">this site</a> or via the contract.</p>
<hr className="modalDivide"></hr>
<p className="modalHeader">How many can be generated?</p>
<p className="modalText">In Phase 1, 3,000 may be generated at a price of 0.007 ETH.</p>
<hr className="modalDivide"></hr>
<p className="modalHeader">Will there be more generation events?</p>
<p className="modalText">Yes. Minting now grants you access to generate new Polygons inheriting traits from your existing Polygons.</p>
<hr className="modalDivide"></hr>
<p className="modalHeader">Is there a creative commons licese?</p>
<p className="modalText">Yes. Polygons Onchain are CC0 ("PUBLIC"). All copyrights are waived under the terms of CC0 1.0. This status is coded into the Polygons Onchain contract.</p>
</Modal>

<Modal
  title='Burn Modal'
  isOpen={burnModalOpen}
  onClose={handleBurnClose}
>
<p className="modalHeader">Burn module activated in Phase 2</p>
<p className="modalText">Burning Polygons creates a new generated Polygon pattern and color scheme.<br></br><br></br>The combination of your Polygon's attributes and new shape combinations introduces new rarity traits, including solid-color designs.</p>
</Modal>
  </div>
      </footer>
    </div>
  );  
};

export default Home;
