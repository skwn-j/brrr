import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
class Setup extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log('navigation: render');
        return (
            <Container>
                <Navbar bg="dark" style={{ height: 20 }}>
                    <Navbar.Brand>
                        Setup
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

export default Setup;