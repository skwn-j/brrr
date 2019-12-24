import React, { Component } from 'react';

// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

//

//components
import AlgorithmList from './AlgorithmListComponent';
import DataReciever from './DataRecieverComponent';


class Setup extends Component {


    uploadStationData = (newData) => {
        this.setState(Object.assign({}, {
            stationData: newData
        }))
        console.log(this.state)

        this.props.selectStationData(newData);
    }

    uploadAlgorithmData = (newData) => {
        console.log(newData)
        let data = this.state.data;
        data.push(newData);
        this.setState(Object.assign({}, {
            data: data
        }))
        console.log(this.state)

        this.props.selectData(newData)
    }


    constructor(props) {
        super(props);

        this.state = {
            stationData: undefined,
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
                        uploadStationData={this.uploadStationData}
                        uploadAlgorithmData={this.uploadAlgorithmData}
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