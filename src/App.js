import React, { Component } from 'react';

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//react-bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//components
import Stations from './stations/StationsComponent';
import Strategies from './strategies/StrategiesComponent';
import Analysis from './analysis/AnalysisComponent';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedData: []
		}
	}

	setStationData = (stationData) => {
		this.setState(Object.assign({}, {
			stationData
		}));
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
					<Col id='stations-wrapper' className='stations' 
						md ={{span: 4}}>
						<Stations
							setStationData={this.setStationData}
							stationData={this.state.stationData}
						>
						</Stations>
					</Col>
					<Col id='comparisons-wrapper' className='comparisons' 
						md ={{span: 4}}>
					</Col>
				</Row>
			</>
		)
	}
}

export default App;
