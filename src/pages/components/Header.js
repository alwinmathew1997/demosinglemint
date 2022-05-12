import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'


export default function Home() {

    return (
        <Navbar expand="lg" variant="dark" className="px-3 px-lg-5">
            <Navbar.Brand href="#top">
                <img className="logo-icon" src={require("../../assets/img/logo.png").default} alt=""/>
                <h3 className="mb-0">NFT</h3>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto text-center text-lg-left">
                    
                 
                    
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}









