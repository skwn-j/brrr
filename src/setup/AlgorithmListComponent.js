import React, { Component } from 'react';

// react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';







class AlgorithmList extends Component {


    handleListClicked = (event) => {
        console.log(event.target.value);
    }

    constructor(props) {
        super(props);
    }

    render() {
        // console.log('navigation: render');
        return (
            <Container>
                {
                    this.props.data !== undefined ?
                        this.props.data.map((data, i) => {
                            return (
                                <Card key={i} className='alg-card'>
                                    <ListGroup action horizontal={true} className='alg-list'>
                                        onClick={this.handleListClicked}>
                                        <ListGroup.Item> Index </ListGroup.Item>
                                        <ListGroup.Item> Name </ListGroup.Item>
                                        <ListGroup.Item> Color </ListGroup.Item>
                                        <ListGroup.Item> UMD </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            )
                        })
                        : null
                }
            </Container>
        )


    }
}

export default AlgorithmList;