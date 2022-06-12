import { useState, useEffect } from 'react'
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap'
import { rinkeby_token_address, ropsten_token_address, token_abi } from '../../backend/contracts/metadata/token'
import { rinkeby_market_address, ropsten_market_address, market_abi } from '../../backend/contracts/metadata/marketplace'

import Web3 from 'web3/dist/web3.min.js';


const Nft = ({item, marketplace, nft, account, marketAddress, tokenAddress }) => {

  const listNFT = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const approve = await nft.methods.approve(marketAddress, item.name).send({ gas: '1000000', from: account });
    const list = await marketplace.methods.listItem(tokenAddress, item.name, 1).send({ gas: '1000000', from: account });

  }



  const openseaLink = 'https://testnets.opensea.io/assets/ropesten/' + tokenAddress + '/' + item.name
  return (

    <div>
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
          style={{ maxHeight: "15rem", minHeight: "15rem", border: "0" }}
          src={item.image}
          alt="nft"
        />
        <div className="card-body">
          <h5 className="card-title">
            {item.id}
          </h5>
        </div>
        <div>
          <Button onClick={listNFT}>List</Button>
        </div>
      </div>
    </div>

  );
}

export default function MyItems({ marketplace, nft, account, tokenAddress, marketAddress }) {
  const [uris, setUris] = useState([]);
  const [myItems, setMyItems] = useState([])

  const getTokens = async () => {

    const web3 = new Web3(Web3.givenProvider);
    const ownedTokens = await nft.methods.walletOfOwner(account).call();
    var data = []
    for (const index in ownedTokens) {
      const element = ownedTokens[index]
      const uri = await nft.methods.tokenURI(element).call();
      const url = "https://ipfs.io/" + "ipfs/" + uri.substring(7);
      const response = await fetch(url)
      const metadata = await response.json()

      metadata['image'] = "https://ipfs.io/" + "ipfs/" + metadata['image'].substring(7);
      myItems.push(metadata);
    };
    setUris(data)
  }


  useEffect(() => {
    console.log(2)
    getTokens();
  }, [])


  return (
    <div className="flex justify-center">
      <div className="d-flex justify-content-center">
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {myItems.length > 0 ? myItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Nft item={item}  marketplace={marketplace} nft={nft} account={account} marketAddress={marketAddress} tokenAddress={tokenAddress} />
                </Card>
              </Col>
            )) :
              <div>
                <p></p>
              </div>}
          </Row>
        </div>
      </div>
    </div>
  );
}