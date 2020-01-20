import React, { Component } from 'react';

// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';


// components
import TemproalComparison from './TemporalComparisonComponent';
import RouteComparison from './RouteComparisonComponent';
import StationComparison from './StationComparisonComponent';

class Comparisons extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log('navigation: render');
        return (

            <Container style={{ paddingLeft: 0 }}>

                <Navbar bg="dark" variant="dark" fixed='top' style={{ position: 'relative', height: 40 }}>
                    <Navbar.Brand>
                        {' Comparison '}
                    </Navbar.Brand>
                </Navbar>

                <TemproalComparison></TemproalComparison>

                <RouteComparison></RouteComparison>

                <StationComparison></StationComparison>

            </Container>

        )
    }
}

export default Comparisons;