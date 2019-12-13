import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
class Summary extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log('navigation: render');
        return (
            <Container>
                <Navbar bg="dark" style={{ height: 20 }}>
                    <Navbar.Brand>
                        Summary
                    </Navbar.Brand>

                </Navbar>
                <Row>
                    Total KPIs
                </Row>
                <Row>
                    Scatterplot
                </Row>
            </Container>

        )
    }
}

export default Summary;