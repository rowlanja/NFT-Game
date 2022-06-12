import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { rinkeby_token_address } from '../../backend/contracts/metadata/token'

import Web3 from 'web3/dist/web3.min.js';


const Nft = ({ nft, staking }) => {
    const openseaLink = 'https://testnets.opensea.io/assets/rinkeby/' + rinkeby_token_address + '/' + nft.name
    return (

        <div>
            <div
                className="card"
                style={{
                    width: "100%",
                    minHeight: "500px",
                }}
            >
                <p>{nft.name}</p>
                <p>{nft.description}</p>
                <p>{nft.edition}</p>
                <p>OpenSea :
                    <a href={openseaLink}>link</a>
                </p>
                <img
                    className="card-img-top"
                    style={{ maxHeight: "15rem", minHeight: "15rem", border: "0" }}
                    src={nft.image}
                    alt="nft"
                />
                <div className="card-body">
                    <h5 className="card-title">
                        {nft.id}
                    </h5>
                </div>
            </div>
        </div>

    );
}

const StakeData = ({ item, staking, account }) => {
    const[seconds,setSeconds]=useState()
    const[minutes,setMinutes]=useState()
    const[hours,setHours]=useState()
    const[days,setDays]=useState()

    const loadData = async () => {
        const stakeData = await staking.methods.GetStakedERC721(account, item.name).call();
        const dateNow = stakeData.timestamp 
        const dateFuture = Math.trunc(Date.now() / 1000);
        
        var seconds = Math.floor((dateFuture - (dateNow)));
        var minutes = Math.floor(seconds/60);
        var hours = Math.floor(minutes/60);
        var days = Math.floor(hours/24);
        
        
        setDays(days)
        setHours(hours-(days*24))
        setMinutes(minutes-(days*24*60)-(hours*60))
        setSeconds(seconds-(days*24*60*60)-(hours*60*60)-(minutes*60))
    }


    useEffect(() => {
        loadData();
    }, [])
    
    return (

        <div>
            <div
                className="card"
                style={{
                    width: "100%",
                    minHeight: "50px",
                    margin: "1px"
                }}
            >
                <p>Staked For : </p>
                <p>{days} days, {hours} hours, {minutes} minutes, {seconds} seconds</p>               
            </div>
        </div>

    );
}

export default function MyItems({ staking, dojo, nft, account, tokenAddress, marketAddress, stakingAddress }) {
    const [uris, setUris] = useState([]);
    const [unstakedTokens, setUnstakedTokens] = useState([])
    const [stakedTokens, setStakedTokens] = useState([])
    const [dojoBalance, setDojoBalance] = useState([])

    const StakeNFT = async (name) => {
        console.log(stakingAddress)
        const approveResult = await nft.methods.approve(stakingAddress,name).send({ gas: '1000000', from: account });
        const stakeResult = await staking.methods.stakeERC721(name).send({ gas: '1000000', from: account });
    }

    const UnstakeNFT = async (name) => {
        const stakeResult = await staking.methods.unstakeERC721(name).send({ gas: '1000000', from: account });
    }

    const getUnstakedTokens = async () => {
        const ownedTokens = await nft.methods.walletOfOwner(account).call();
        var data = []
        for (const index in ownedTokens) {

            const element = ownedTokens[index]
            const uri = await nft.methods.tokenURI(element).call();
            const url = "https://ipfs.io/" + "ipfs/" + uri.substring(7);
            const response = await fetch(url)
            const metadata = await response.json()

            metadata['image'] = "https://ipfs.io/" + "ipfs/" + metadata['image'].substring(7);
            unstakedTokens.push(metadata);

        
        };
        setUris(data)
    }
    const getStakedTokens = async () => {
        const ownedTokens = await staking.methods.GetAllStakedERC721(account).call();
        var data = []
        for (const index in ownedTokens) {
            const element = ownedTokens[index]
            const uri = await nft.methods.tokenURI(element).call();
            const url = "https://ipfs.io/" + "ipfs/" + uri.substring(7);
            const response = await fetch(url)
            const metadata = await response.json()

            metadata['image'] = "https://ipfs.io/" + "ipfs/" + metadata['image'].substring(7);
            stakedTokens.push(metadata);
        };
        setUris(data)
    }

    const setAccountInfo = async () => {
        const balance = await dojo.methods.balanceOf(account).call();
        setDojoBalance(balance)
    }


    useEffect(() => {
        console.log('using mkt add : ', marketAddress, ' token add : ', tokenAddress)

        getUnstakedTokens();
        getStakedTokens();
        setAccountInfo();
    }, [])


    return (
        <div>
            <div>
                <p>Dojo Balance : {dojoBalance}</p>
            </div>
            <div className="d-flex justify-content-center">
                <div className="px-5 container">
                    <h2>Unstaked Tokens</h2>
                    <Row xs={2} md={4} lg={2} className="g-2 py-5">
                        {unstakedTokens.length > 0 ? unstakedTokens.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <div
                                        style={{
                                            width: "100%",
                                            margin: "0 auto",
                                            paddingBottom: "10px",
                                            minHeight: "500px",
                                            boxShadow: "2px 3px 7px rgb(0 0 0 / 0.2)",
                                        }}
                                    >
                                        <Nft nft={item} staking={staking} />
                                        <Button onClick={() => StakeNFT(item.name)}>Stake</Button>
                                    </div>
                                </Card>
                            </Col>
                        )) :
                            <div>
                                <p></p>
                            </div>}
                    </Row>
                </div>
                <div
                    className="px-5 container"
                >
                    <h2>Staked Tokens</h2>
                    <Row xs={1} md={2} lg={2} className="g-4 py-5">
                        {stakedTokens.length > 0 ? stakedTokens.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <div
                                        style={{
                                            width: "100%",
                                            margin: "0 auto",
                                            paddingBottom: "10px",
                                            minHeight: "500px",
                                            boxShadow: "2px 10px 15px rgb(0 0 0 / 0.2)",
                                        }}
                                    >
                                        <Nft nft={item} staking={staking} />
                                        <Button onClick={() => UnstakeNFT(item.name)}>Unstake</Button>
                                        <StakeData item={item} staking={staking} account={account}/>
                                    </div>
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