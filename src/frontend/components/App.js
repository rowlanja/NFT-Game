import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Mint from './Mint.js'
import Staking from './Staking'
import MyItems from './MyItems'
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import { useState } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import { rinkeby_token_address, ropsten_token_address, token_abi } from '../../backend/contracts/metadata/token'
import { rinkeby_market_address, ropsten_market_address, market_abi } from '../../backend/contracts/metadata/marketplace'

import { ropsten_dojo_address, dojo_abi } from '../../backend/contracts/metadata/dojo'
import { ropsten_staking_address, staking_abi } from '../../backend/contracts/metadata/staking'


import './App.css';
import Web3 from 'web3/dist/web3.min.js';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [staking, setStakingContract] = useState(); // storage that the contract made
  const [dojo, setDojoContract] = useState(); // storage that the contract made
  const [tokenContract, setTokenContract] = useState(); // storage that the contract made
  const [marketContract, setMarketContract] = useState(); // storage that the contract made 

  const [marketAddress, setMarketAddress] = useState(); // storage that the contract made 
  const [tokenAddress, setTokenAddress] = useState(); // storage that the contract made 
  const [stakingAddress, setStakingAddress] = useState(); // storage that the contract made 


  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })
    const web3 = new Web3(window.ethereum)

    const currentChainId = await web3.eth.net.getId()
    // console.log('home chain : ', typeof currentChainId)
    if(currentChainId === 3){ // ropsten
      setTokenContract(new web3.eth.Contract(token_abi, ropsten_token_address));
      setMarketContract(new web3.eth.Contract(market_abi, ropsten_market_address));
      setStakingContract(new web3.eth.Contract(staking_abi, ropsten_staking_address));
      setDojoContract(new web3.eth.Contract(dojo_abi, ropsten_dojo_address));
      
      setTokenAddress(ropsten_token_address);      
      setMarketAddress(ropsten_market_address);     
      setStakingAddress(ropsten_staking_address);
      
    }
    else if(currentChainId == 4){ // rinkeby
      setTokenContract(new web3.eth.Contract(token_abi, rinkeby_token_address));
      setMarketContract(new web3.eth.Contract(market_abi, rinkeby_market_address));
    
          
      setTokenAddress(rinkeby_token_address);      
      setMarketAddress(rinkeby_market_address);    
    }
    else {
      setTokenContract(new web3.eth.Contract(token_abi, rinkeby_token_address));
      setMarketContract(new web3.eth.Contract(market_abi, rinkeby_market_address));  
    }
    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    console.log('dojo : ', dojo)
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const web3 = new Web3(Web3.givenProvider);

    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketContract} nft={tokenContract}  account={account} tokenAddress={tokenAddress} marketAddress={marketAddress}/>
              } />
              <Route path="/create" element={
                <Mint marketplace={marketContract} nft={tokenContract} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketContract} nft={tokenContract} account={account} tokenAddress={tokenAddress} marketAddress={marketAddress}/>
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketContract} nft={tokenContract} account={account} tokenAddress={tokenAddress} marketAddress={marketAddress}/>
              } />
              <Route path="/my-items" element={
                <MyItems marketplace={marketContract} nft={tokenContract} account={account} tokenAddress={tokenAddress} marketAddress={marketAddress}/>
              } />
              <Route path="/staking" element={
                <Staking staking={staking} dojo={dojo} nft={tokenContract} account={account} tokenAddress={tokenAddress} marketAddress={marketAddress} stakingAddress={stakingAddress} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
