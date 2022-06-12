import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container, ListGroup,  } from 'react-bootstrap'
import './App.css'

const navbar = {backgroundColor: '#F16E10'};


const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar className='color-nav' expand="lg" >
            <Container>
                <Navbar.Brand href="http://www.dappuniversity.com/bootcamp">
                    <h1 >⚔️ </h1>  <h6 className="navItem">Ninja Marketplace</h6>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/"><h6 className="navItem" >Ninja Market</h6></Nav.Link>
                        <Nav.Link as={Link} to="/create"><h6 className="navItem" >Mint</h6></Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items"><h6 className="navItem" >Listed Ninjas</h6></Nav.Link>
                        {/* <Nav.Link as={Link} to="/my-purchases"><h6 className="navItem" >My Purchases</h6></Nav.Link> */}
                        <Nav.Link as={Link} to="/my-items"><h6 className="navItem" >My Dojo</h6></Nav.Link>
                        <Nav.Link as={Link} to="/staking"><h6 className="navItem" >Samu Mountain</h6></Nav.Link>
                        <Nav.Link as={Link} to="/battle"><h6 className="navItem" >Sengoku Grounds</h6></Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;