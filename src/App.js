import React, { Component } from 'react';

//react-bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//components
import Setup from './components/SetupComponent';
import Summary from './components/SummaryComponent';

class App extends Component {


	render() {
		return (
			<>
				<Navbar bg="dark" variant="dark" fixed='top' style={{ position: 'relative', height: 60 }}>
					<Navbar.Brand href="#home">
						{' Bike Rebalancing Review and Reinfore '}
					</Navbar.Brand>
				</Navbar>

				<Row>
					<Col id='setup-wrapper' className='setup'
						style={{ width: 300, height: 1000, padding: '0px', float: 'left' }}>
						<Setup></Setup>
						<Summary></Summary>
						</Col>
					<Col id='comparison-wrapper' className='comparison'
						style={{ width: 700, height: 1000, padding: '0px', float: 'left' }}>
						comparison
						</Col>
					<Col id='analysis-wrapper' className='analysis'
						style={{ width: 700, height: 1000, padding: '0px', float: 'left' }}>
						analysis
						</Col>
				</Row>
			</>
		)
	}
}

export default App;
