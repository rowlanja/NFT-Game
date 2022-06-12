import { useState, useEffect  } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import img from '../../imgs/0.png'
import { ropsten_token_address, token_abi } from '../../backend/contracts/metadata/token'
import Web3 from 'web3/dist/web3.min.js';

const Mint = ({ marketplace, nft, account }) => {
  const [tokenContract, setTokenContract] = useState(); // storage that the contract made

  const createNFT = async () => {
    mint()
  }

  const mint = async () => {
    // mint nft 
    console.log('account',account )
    await tokenContract.methods.mint(account, 1).send({ gas: '1000000', from: account });
  }

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider || ' https://api.avax-test.network/ext/bc/C/rpc');
    setTokenContract(new web3.eth.Contract(token_abi, ropsten_token_address));
  }, []);

  return (
    <div className="container-fluid mt-5">
      <div className="row">
          <div className="content mx-auto">
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Mint List NFT!
                </Button>
              </div>
          </div>
      </div>
    </div>
  );
}

export default Mint