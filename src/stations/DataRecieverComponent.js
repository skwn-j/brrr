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


const createKpiData = (inventoryData, pickupDemandData, returnDemandData, routeData) => {

    let kpiData = [];
    //initialize [id, Kpi condition, visit count]
    let temp = Object.keys(this.state.stationData).map(d => [d, { 'umd': 0, 'zvt': false, 'fpt': false, 'stb': true }, 0]);
    Object.entries(inventoryData).forEach(([dt, inv]) => {
        const truckVists = Object.values(routeData).map(tr => tr.find(vs => vs.time === +dt))
        // update visit count
        truckVists.forEach(vs => {
            if (vs !== undefined) {
                // find out visited station (to St) and increment visit count
                const ti = temp.findIndex(t => t[0] === vs.station);
                temp[ti][2] += 1;
                // reflect inventory difference derived from truck
                // No need for in this dataset
            }
        })

        // Demand of ceratin time period
        const pickupDemands = pickupDemandData[dt];
        const returnDemands = returnDemandData[dt];
        const netDemands = Object.entries(pickupDemands).map(d => [d[0], returnDemands[d[0]] - d[1]]);
        // update kpi conditon
        Object.entries(inv).forEach(d => {
            const ti = temp.findIndex(t => t[0] === d[0]);
            // inventory check
            if (d[1] + netDemands.find(dm => dm[0] === d[0])[1] < 0) {
                // unmet demand 
                temp[ti][1]['umd'] = Math.abs(netDemands.find(dm => dm[0] === d[0])[1]);
                temp[ti][1]['zvt'] = true;
                temp[ti][1]['fpt'] = false;
                temp[ti][1]['stb'] = false;
            }
            else if (d[1] === 0) {
                // zero vehicle time
                temp[ti][1]['umd'] = 0
                temp[ti][1]['zvt'] = true;
                temp[ti][1]['stb'] = false;
                temp[ti][1]['fpt'] = false;
            }
            else if (d[1] >= this.state.stationData[d[0]].capacity) {
                // full port time
                temp[ti][1]['zvt'] = false;
                temp[ti][1]['fpt'] = true;
                temp[ti][1]['stb'] = false;
                temp[ti][1]['umd'] = 0
            }
            else {
                temp[ti][1]['zvt'] = false;
                temp[ti][1]['fpt'] = false;
                temp[ti][1]['stb'] = true;
                temp[ti][1]['umd'] = 0
            }
            // TODO: demand check
            // Ask Seo how i can get umd from data
        })
        const curr = JSON.parse(JSON.stringify(temp));
        // update data
        kpiData.push([
            +dt,
            curr
        ])
    })

    return kpiData;
}
const parseCSV = (csv) => {
    let result = {};
    const head = csv[0];
    const body = csv.slice(1);
    if (head[0] === 'datetime') {
        // inventory, demand
        for (let row of body) {
            let obj = {};
            const dt = Date.parse(row[0]);
            row.forEach((d, i) => {
                if (i > 0 && head[i] !== "") {
                    obj[head[i]] = +d;
                }
            })
            result[dt] = obj;
        }
    }
    else if (head[0] === 'Truck') {
        // truck movement
        let prevLoad = 0;
        for (let i in body) {
            const [truck, load, fromTime, fromSt, toTime, toSt] = body[i];
            if (!result.hasOwnProperty(truck)) {
                result[truck] = [];
            }
            result[truck].push({
                station: fromSt,
                time: Date.parse(fromTime),
                in: prevLoad,
                out: +load,
                travel: Date.parse(toTime) - Date.parse(fromTime)
            })
            prevLoad = +load;

            if (i === body.length - 1) {
                result[truck].push({
                    station: toSt,
                    time: Date.parse(toTime),
                    in: +load,
                    out: 0,
                    travel: 0
                })
            }
        }
    }
    else {
        // station
        for (let row of body) {
            // 구명,ID,num,대여소명,대여소.주소,거치대수,lat,lon
            const [province, id, num, name, location, capacity, lat, lng] = row;
            result[id] = {
                id,
                province,
                num,
                name,
                location,
                capacity: +capacity,
                coords: [+lng, +lat]
            };
        }
    }
    return result;
}


class DataReciever extends Component {

    handleSubmitClick = (event) => {
        console.log(this.state);
        const { routeData, inventoryData, pickupDemandData, returnDemandData } = this.state;
        const kpiData = createKpiData(inventoryData, pickupDemandData, returnDemandData, routeData);
        this.props.uploadAlgorithmData([
            inventoryData, pickupDemandData, returnDemandData, routeData, kpiData
        ])
    }

    handleFileUpload(event) {
        const { uploadStationData } = this.props;
        const id = event.target.id;
        const file = event.target.files[0];
        const name = file.name;
        // csv


        Papa.parse(file, {
            complete: (res) => {
                let data = parseCSV(res.data.filter(d => d.length > 1));
                if (id === 'formStation') {
                    this.setState(Object.assign({
                        stationData: data
                    }))
                    uploadStationData(data);
                }
                else if (id === 'formInventory') {
                    this.setState(Object.assign({
                        inventoryData: data
                    }))
                }
                else if (id === 'formPickup') {
                    this.setState(Object.assign({
                        pickupDemandData: data
                    }))
                }
                else if(id === 'formReturn') {
                    this.setState(Object.assign({
                        returnDemandData: data
                    }))
                }
                else if (id === 'formRoute') {
                    this.setState(Object.assign({
                        routeData: data
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
                    <Form.Group controlId='formPickup'>
                        <Form.Label> Pickup Demand Data </Form.Label>
                        <Form.Control
                            type='file'
                            ref={this.demandDataRef}
                            onChange={(e) => this.handleFileUpload(e)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='formReturn'>
                        <Form.Label> Return Demand Data </Form.Label>
                        <Form.Control
                            type='file'
                            ref={this.demandDataRef}
                            onChange={(e) => this.handleFileUpload(e)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='formRoute'>
                        <Form.Label> Route Data </Form.Label>
                        <Form.Control
                            type='file'
                            ref={this.routeDataRef}
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