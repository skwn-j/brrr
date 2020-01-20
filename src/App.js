import React, { Component } from "react";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//react-bootstrap
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

//components
import Setup from "./setup/SetupCopmonent";
import Comparisons from "./comparison/ComparisonsComponent";
import Detail from "./detail/DetailComponent";

// temporary file reader
import Papa from "papaparse";

const localStations = "station_yeouido_depot.csv";
const localA = [
	"dataA/ExpectedInventory_10221855.csv",
	"dataA/PredictedPickupDemand_10221855.csv",
	"dataA/PredictedReturnDemand_10221855.csv",
	"dataA/TruckMovements_10221855.csv"
];

const localB = [
	"dataA/ExpectedInventory_10271016.csv",
	"dataA/PredictedPickupDemand_10271016.csv",
	"dataA/PredictedReturnDemand_10271016.csv",
	"dataA/TruckMovements_10271016.csv"
];

/*
	From Data Recevier component. to be removed
*/
const createKpiData = (stationData, data) => {
	const [ inventoryData, pickupDemandData, returnDemandData, routeData ] = data;
    let kpiData = [];
    //initialize [id, Kpi condition, visit count]
    let temp = Object.keys(stationData).map(d => [d, { 'umd': 0, 'zvt': false, 'fpt': false, 'stb': true }, 0]);
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
            else if (d[1] >= stationData[d[0]].capacity) {
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

const parseCSV = csv => {
	let result = {};
	const head = csv[0];
	const body = csv.slice(1);
	if (head[0] === "datetime") {
		// inventory, demand
		for (let row of body) {
			let obj = {};
			const dt = Date.parse(row[0]);
			row.forEach((d, i) => {
				if (i > 0 && head[i] !== "") {
					obj[head[i]] = +d;
				}
			});
			result[dt] = obj;
		}
	} else if (head[0] === "Truck") {
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
			});
			prevLoad = +load;

			if (i === body.length - 1) {
				result[truck].push({
					station: toSt,
					time: Date.parse(toTime),
					in: +load,
					out: 0,
					travel: 0
				});
			}
		}
	} else {
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
};

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stationData: undefined,
			data: []
		};
	}

	async addStations() {
		const arr = await fetch(localStations)
			.then(response => {
				return response.text();
			})
			.then(text => {
				const parsedText = Papa.parse(text, {
					complete: res => {
						return res.data;
					}
				});
				return parsedText.data.filter(d => d.length > 1);
			});

		const stationData = parseCSV(arr);
		console.log(stationData);
		this.setState(
			Object.assign(
				{},
				{
					stationData
				}
			)
		);
	}

	async addData1() {
		let dataA = [];
		for (let loc of localA) {
			const arr = await fetch(loc)
				.then(response => {
					return response.text();
				})
				.then(text => {
					const parsedText = Papa.parse(text, {
						complete: res => {
							return res.data;
						}
					});
					return parsedText.data.filter(d => d.length > 1);
				});
			const data = parseCSV(arr);
			dataA.push(data);
		}
		console.log(dataA);
		const kpiData = createKpiData(this.state.stationData, dataA)
		dataA.push(kpiData);
		const newData = this.state.data.push(dataA);
		this.setState(
			Object.assign(
				{},
				{
					data: newData
				}
			)
		);
	}

	async addData2() {
		let dataB = [];
		for (let loc of localB) {
			const arr = await fetch(loc)
				.then(response => {
					return response.text();
				})
				.then(text => {
					const parsedText = Papa.parse(text, {
						complete: res => {
							return res.data;
						}
					});
					return parsedText.data.filter(d => d.length > 1);
				});
			const data = parseCSV(arr);
			dataB.push(data);
		}

		const kpiData = createKpiData(this.state.stationData, dataB)
		dataB.push(kpiData);
		const newData = this.state.data.push(dataB);
		this.setState(
			Object.assign(
				{},
				{
					data: newData
				}
			)
		);
		console.log(dataB);
	}

	setStationData = stationData => {
		this.setState(
			Object.assign(
				{},
				{
					stationData
				}
			)
		);
	};

	selectData = newData => {
		let data = this.state.selectData;
		data.push(newData);
		this.setState(
			Object.assign(
				{},
				{
					selectedData: newData
				}
			)
		);

		console.log(this.selectedData);
	};

	removeData = oldData => {
		const oldName = oldData[0];
	};

	render() {
		return (
			<>
				<Navbar
					bg="primary"
					variant="dark"
					fixed="top"
					style={{ position: "relative", height: 60 }}
				>
					<Navbar.Brand href="#home">
						{" Bike Rebalancing Review and Reinfore "}
					</Navbar.Brand>
				</Navbar>
				<Row style={{ width: 1920 }} noGutters={true}>
					<Col
						id="setup-wrapper"
						className="setup"
						md={{ span: 1.5 }}
					>
						<Button
							variant="dark"
							onClick={e => this.addStations()}
						>
							{" Stations "}
						</Button>
						<Button variant="dark" onClick={e => this.addData1()}>
							{" Data1 "}
						</Button>
						<Button variant="dark" onClick={e => this.addData2()}>
							{" Data2 "}
						</Button>
					</Col>
					<Col
						id="comparisons-wrapper"
						className="comparisons"
						md={{ span: 6 }}
					>
						<Comparisons
							stationData={this.state.stationData}
							data={this.state.data}
						></Comparisons>
					</Col>
					<Col id="details-wrapper" md={{ span: 4.5 }}>
						<Detail></Detail>
					</Col>
				</Row>
			</>
		);
	}
}

export default App;
