import React, { Component } from 'react';

// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
class Analysis extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log('navigation: render');
        return (
            <Container>
                <Navbar bg="dark" variant="dark" fixed='top' style={{ position: 'relative', height: 40 }}>
							<Navbar.Brand >
								{' Analysis '}
							</Navbar.Brand>
						</Navbar>
                <Row>
                    Station Data
                </Row>
                <Row>
                    Algorithms
                </Row>
                <Row>
                    
                </Row>

            </Container>

        )
    }
}

export default Analysis;