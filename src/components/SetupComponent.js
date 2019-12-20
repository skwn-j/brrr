import React, { Component } from 'react';

// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';


const StationDataReceiver = () => {
    return (
        <Container>
            <Navbar expand="sm" variant="light" bg="light" style={{ position: 'relative', height: 20  }}>
                <Navbar.Brand href="#"> Station Data </Navbar.Brand>
            </Navbar>
            <input type='file' name='Stations' onChange={e => console.log(e.target.files[0])}></input>
        </Container>
    )
}

const AlgorithmDataReceiver = () => {
    return (
        <Container>
            <input type='file' name='Inventory' onChange={e => console.log(e.target)}></input>
            <input type='file' name='Demand' onChange={e => console.log(e.target)}></input>
            <input type='file' name='Route' onChange={e => console.log(e.target)}></input>
        </Container>
    )
}


class Setup extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log('navigation: render');
        return (
            <Container>
                <Navbar bg="dark" variant="dark" fixed='top' style={{ position: 'relative', height: 40 }}>
                    <Navbar.Brand>
                        {' Setup '}
                    </Navbar.Brand>
                </Navbar>
                <Row>
                    <StationDataReceiver></StationDataReceiver>
                </Row>
                <Row>
                    Algorithm Data
                </Row>
                <Row>

                </Row>

            </Container>

        )
    }
}

export default Setup;