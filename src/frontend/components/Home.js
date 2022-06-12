import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, AccordionButton } from 'react-bootstrap'
import { rinkeby_token_address, token_abi } from '../../backend/contracts/metadata/token'

import Web3 from 'web3/dist/web3.min.js';


const NftItem = ({ item, marketplace, nft, account }) => {

  const BuyNFT = async () => {
    const web3 = new Web3(Web3.givenProvider);

    const buy = await marketplace.methods.purchaseItem(item.name).send({ gas: '1000000', from: account, value:  web3.utils.toWei('1', 'ether')});
    console.log('buy : ', buy)
  } 
  const openseaLink = 'https://testnets.opensea.io/assets/rinkeby/'+rinkeby_token_address+'/'+item.name
  return (

      <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12  mb-5"> 
        <div
          className="card"
          style={{
            width: "100%",
            margin: "0 auto",
            paddingBottom: "10px",
            minHeight: "500px", 
            boxShadow: "2px 3px 7px rgb(0 0 0 / 0.2)",
          }}
        >
          <p>{item.name}</p>
          <p>{item.description}</p>
          <p>{item.edition}</p>
          <p>OpenSea : 
            <a href={openseaLink}>link</a>
          </p>
          <img
            className="card-img-top"
            style={{ maxHeight: "15rem", minHeight: "15rem",border:"0" }}
            src={item.image}
            alt="nft"
          />
          <div className="card-body">
            <h5 className="card-title">
             {item.id}
            </h5>
          </div>
          <div>
            <Button onClick={BuyNFT}>Buy</Button> 
          </div>
        </div>
      </div>

  );
}

export default function MyItems({ marketplace, nft, account,  tokenAddress, marketAddress }) {
  const [items, setItems] = useState([]);

  const [uris, setUris] = useState([]);

  const getTokens = async () => {
    const web3 = new Web3(Web3.givenProvider);

    const ownedTokens =  await marketplace.methods.getItemIds().call(); 
    console.log('ot : ', ownedTokens)
    var data = []
    for (const index in ownedTokens) {
      var tokenId = ownedTokens[index]
      const nftdata = await marketplace.methods.items(tokenId).call();   
        if(nftdata.seller.toLowerCase() != account.toLowerCase()){
          const uri = await nft.methods.tokenURI(tokenId).call();
          const url="https://ipfs.io/"+"ipfs/"+uri.substring(7);
          const response = await fetch(url)
          const metadata = await response.json()
          metadata['image'] = "https://ipfs.io/"+"ipfs/"+metadata['image'].substring(7);
          items.push(metadata);
        }
      }
    setUris(data)
  }

  
  useEffect(() => {
    getTokens();  
  }, [])

  return (
    <div className="flex justify-center">
      {items.length > 0 ? items.map((item, idx) => (
        <div>
           <NftItem item={item} marketplace={marketplace} nft={nft} account={account}/>
        </div>
      ))  : 
      <div>
      <p></p>
      </div>}
  </div>
  );
}