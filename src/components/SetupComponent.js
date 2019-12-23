import React, { Component } from 'react';

// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

//

//components
import AlgorithmList from '../setup/AlgorithmListComponent';
import DataReciever from '../setup/DataRecieverComponent';


class Setup extends Component {


    uploadData = (newData) => {
        console.log(newData)
        let data = this.state.data;
        data.push(newData);
        this.setState(Object.assign({}, {
            data: data
        }))
        console.log(this.state)
    }


    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    render() {
        // console.log('navigation: render');
        return (
            <Container style={{ paddingLeft: 0 }}>
                <Navbar bg="dark" variant="dark" fixed='top' style={{ position: 'relative', height: 40 }}>
                    <Navbar.Brand>
                        {' Setup '}
                    </Navbar.Brand>
                </Navbar>
                <Row>
                    <DataReciever
                        uploadData={this.uploadData}
                    ></DataReciever>
                </Row>
                <Row>
                    <AlgorithmList
                        data={this.state.data}
                    > </AlgorithmList>
                </Row>

            </Container>

        )
    }
}

export default Setup;