import React, { Component } from 'react';
import Papa from 'papaparse';
// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//

//components
import DataReciever from './DataRecieverComponent';
import StationsComparison from '../comparison/StationComparisonComponent';

class Setup extends Component {

    handleSubmitClick = (event) => {

        const { setStationData } = this.props;
        console.log(this.stationData)
        setStationData(this.stationData)
    }

    handleFileUpload(event) {
        console.log('upload staiton data')
        const file = event.target.files[0];

        // csv
        Papa.parse(file, {
            complete: (res) => {
                const body = res.data.filter(d => d.length > 1).slice(1);
                let result = {}
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
                console.log(result);
                this.stationData = result;
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

    uploadStationData = (newData) => {
        this.setState(Object.assign({}, {
            stationData: newData
        }))
        console.log(this.state)

        this.props.selectStationData(newData);
    }

    constructor(props) {
        super(props);  
        this.stationData = undefined;
    }

    render() {
        // console.log('navigation: render');
        return (
            <Container >
                <Navbar bg="dark" variant="dark" fixed='top' style={{ position: 'relative', height: 40 }}>
                    <Navbar.Brand>
                        {' Stations '}
                    </Navbar.Brand>
                </Navbar>
                <Row style={{ position: 'relative', height: 80, margin: 0}}>
                    <Form style = {{paddingLeft: 15}}>
                        <Form.Group controlId='formStation'>
                            <Form.Label> Station Data </Form.Label>
                            <Form.Control
                                type='file'
                                onChange={(e) => this.handleFileUpload(e)}
                            ></Form.Control>
                        </Form.Group>
                    </Form>
                    <Button
                        type='submit'
                        variant='primary'
                        onClick={(e) => this.handleSubmitClick(e)}
                        >
                        {'Submit'}
                    </Button>
                </Row>
            </Container>

        )
    }
}

export default Setup;