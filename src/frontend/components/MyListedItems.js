import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { rinkeby_token_address, ropsten_token_address, token_abi } from '../../backend/contracts/metadata/token'
import { rinkeby_market_address, ropsten_market_address ,market_abi } from '../../backend/contracts/metadata/marketplace'

import Web3 from 'web3/dist/web3.min.js';


const NftItem = ({ item, marketplace, account, nft, marketAddress, tokenAddress }) => {

  const listNFT = async () => {
    console.log('rendering : ',account)
    const list = await marketplace.methods.delistItem(item.name).send({ gas: '1000000', from: account });
  } 

  const openseaLink = 'https://testnets.opensea.io/assets/rinkeby/'+rinkeby_token_address+'/'+item.name
  return (

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
            <Button onClick={listNFT}>Unlist</Button> 
          </div>
        </div>

  );
}

export default function MyItems({ marketplace, nft, account,  tokenAddress, marketAddress }) {
  const [items, setItems] = useState([]);
  const [uris, setUris] = useState([]);

  const getTokens = async () => {
    const ownedTokens = await marketplace.methods.getItemIds().call();
    console.log('ot : ', ownedTokens)
    var data = []
    for(var index in ownedTokens){
      const id = ownedTokens[index]
      console.log('id : ', id)
      const nftdata = await marketplace.methods.items(id).call();   
        console.log(nftdata)
        console.log(id)

        if(nftdata.seller.toLowerCase() == account.toLowerCase()){
          const uri = await nft.methods.tokenURI(id).call();
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
      <div className="d-flex justify-content-center">
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.length > 0 ? items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                <NftItem item={item} marketplace={marketplace} account={account} nft={nft} marketAddress={marketAddress} tokenAddress={tokenAddress}/>
                </Card>
              </Col>
            ))  :
            <div>
              <p></p>
            </div>}
        </Row>
      </div>
    </div>
  </div>
  );
}