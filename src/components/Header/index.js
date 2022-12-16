import { Container, Nav, Navbar } from 'react-bootstrap';
import img from '../../assets/mizuho-bank-logo.png';

const Header = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">
                    <img alt="Mizuho Bank" src={img} width="auto" height="50vh" className="d-inline-block align-top" />
                </Navbar.Brand>
                <Navbar.Toggle variant="light" aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Item as="li">
                            <Nav.Link eventKey="link-1" href="/">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link eventKey="link-1" href="/about">About</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
