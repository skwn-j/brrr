import React, { Component } from 'react';

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//react-bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//components
import Setup from './setup/SetupComponent';
import Comparison from './comparison/ComparisonComponent';
import Analysis from './analysis/AnalysisComponent';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedData: []
		}
	}

	selectStationData = (stationData) => {
		this.setState(Object.assign({}, {
			selectedStationData: stationData
		}));

		console.log(this.state.selectedStationData);
	}

	selectData = (newData) => {
		let data = this.state.selectData;
		data.push(newData);
		this.setState(Object.assign({}, {
			selectedData: newData
		}));

		console.log(this.selectedData);
	}

	removeData = (oldData) => {
		const oldName = oldData[0]
	}

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
						<Setup
							selectStationData={this.selectStationData}
							selectData={this.selectData}
						>

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
