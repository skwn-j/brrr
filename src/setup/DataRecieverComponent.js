import React, { Component } from 'react';

// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
//
import Papa from 'papaparse';


class DataReciever extends Component {

    handleSubmitClick = (event) => {
        console.log(this.state);
        const {stationData, truckData, inventoryData, demandData} = this.state;
        this.props.uploadData([
            stationData, inventoryData, demandData, truckData
        ])
    }

    handleFileUpload(event) {
        
        const id = event.target.id;
        const file = event.target.files[0];
        const name = file.name;
        // csv

        console.log(this);

        Papa.parse(file, {
            complete: (res) => {
                const data = res.data;
                if (id === 'formStation') {
                    this.setState(Object.assign({
                        stationData: data
                    }))
                }
                else if (id === 'formInventory') {
                    this.setState(Object.assign({
                        inventoryData: data
                    }))
                }
                else if (id === 'formDemand') {
                    this.setState(Object.assign({
                        demandData: data
                    }))
                }
                else if (id === 'formTruck') {
                    this.setState(Object.assign({
                        truckData: data
                    }))
                }
                else {
                    //Error
                }
            }
        })

        // TODO: Allow json file format
        /*
        if (file.type === 'application/vnd.ms-excel') {
            const parsedText = Papa.parse(this.stationData.current.files[0], {
                complete: (res) => {
                    console.log(res)
                    return res.data;
                }
            })
        }
        // json
        else if (file.type === 'json') {
        }
        else {
        }
        */
    }

    StationDataReceiver = (
        <Popover id='popover-station'>
            <Popover.Title as='h3'> Station Data </Popover.Title>
            <Popover.Content>
                <Form>
                    <Form.Group controlId='formStation'>
                        <Form.Label> Station Data </Form.Label>
                        <Form.Control
                            type='file'
                            ref={this.stationDataRef}
                            onChange={(e) => this.handleFileUpload(e)}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Popover.Content>
        </Popover>
    )


    AlgorithmDataReceiver = (
        <Popover id='popover-algorithm'>
            <Popover.Title as='h3'> Algorithm Data </Popover.Title>
            <Popover.Content>
                <Form>
                    <Form.Group controlId='formInventory'>
                        <Form.Label> Inventory Data </Form.Label>
                        <Form.Control
                            type='file'
                            ref={this.inventoryDataRef}
                            onChange={(e) => this.handleFileUpload(e)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='formDemand'>
                        <Form.Label> Demand Data </Form.Label>
                        <Form.Control
                            type='file'
                            ref={this.demandDataRef}
                            onChange={(e) => this.handleFileUpload(e)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='formTruck'>
                        <Form.Label> Truck Data </Form.Label>
                        <Form.Control
                            type='file'
                            ref={this.truckDataRef}
                            onChange={(e) => this.handleFileUpload(e)}></Form.Control>
                    </Form.Group>
                </Form>
            </Popover.Content>
        </Popover>
    )



    constructor(props) {

        super(props);


        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.stationDataRef = React.createRef();
        this.inventoryDataRef = React.createRef();
        this.demandDataRef = React.createRef();
        this.truckDataRef = React.createRef();
    }

    render() {
        // console.log('navigation: render');
        return (
            <Row>
                <OverlayTrigger
                    trigger='click'
                    placement='right'
                    overlay={this.StationDataReceiver}>
                    <Button
                        variant='primary'
                        style={{ margin: 30 }}
                        ref={this.stationDataRef}
                        onClick={this.handleButtonClick}>
                        {'New Station Data'}
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger
                    trigger='click'
                    placement='right'
                    overlay={this.AlgorithmDataReceiver}>
                    <Button
                        variant='primary'
                        style={{ margin: 30 }}
                        ref={this.algorithmDataRef}
                        onClick={this.handleButtonClick}>
                        {'New Algorithm Data'}
                    </Button>
                </OverlayTrigger>
                <Button onClick={this.handleSubmitClick}>
                    Submit
                </Button>
            </Row>
        )
    }
}

export default DataReciever;