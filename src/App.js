import React, { Component } from 'react';

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//react-bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//components
import Setup from './components/SetupComponent';
import Comparison from './components/ComparisonComponent';
import Analysis from './components/AnalysisComponent';

class App extends Component {


	render() {
		return (
			<>
				<Navbar bg="primary" variant="dark" fixed='top' style={{ position: 'relative', height: 60 }}>
					<Navbar.Brand href="#home">
						{' Bike Rebalancing Review and Reinfore '}
					</Navbar.Brand>
				</Navbar>
				<Row style={{ width: 1920 }} noGutters={true}>
					<Col id='setup-wrapper' className='setup' 
						md ={{span: 2}}>
						<Setup>

						</Setup>
					</Col>
					<Col id='comparison-wrapper' className='comparison'
						md ={{span: 5}}>
						<Comparison>

						</Comparison>

					</Col>
					<Col id='analysis-wrapper' className='analysis' 
						md ={{span: 5}}>
						<Analysis>

						</Analysis>
					</Col>
				</Row>
			</>
		)
	}
}

export default App;
