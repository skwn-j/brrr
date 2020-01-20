import React, { Component } from 'react';

// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';

// components
import Map from './MapComponent';
class Detail extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log('navigation: render');
        return (
            <Container style={{paddingLeft: 0, paddingRight: 0}}>
                <Navbar bg="dark" variant="dark" fixed='top' style={{ position: 'relative', height: 40 }}>
							<Navbar.Brand >
								{' Detail '}
							</Navbar.Brand>
						</Navbar>

            </Container>

        )
    }
}
 
export default Detail;