// react
import React, { Component } from 'react';
//d3
import * as d3 from 'd3';
// map interaction

const svgHeight = 770;
const svgWidth = 770;
const margin = { left: 40, right: 10, top: 10, bottom: 20 }

const height = svgHeight - margin.top - margin.bottom;
const width = svgWidth - margin.left - margin.right;

const CURRENTTIME = 1505911800000;
const KPIS = ['umd', 'zvt', 'ovf', 'fpt', 'stb'];

const oranges = d3.scaleOrdinal(d3.schemeYlOrRd[7]);
const greens = d3.scaleOrdinal(d3.schemePuBuGn[7]);

const translate = (x, y) => {
    return 'translate(' + x + ',' + y + ')';
}

const algColorScale = (i) => {
    return d3.schemeAccent[i];
}


const t = d3.transition().duration(500);

class StationComparison extends Component {

    initChart = () => {
        this.chart = d3.select(this.myRef).append('g')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'chart')
            .attr('transform', translate(margin.left, margin.top));
        this.xAxis = this.chart.append('g')
            .attr('class', 'xAxis').attr('transform', translate(0, height));
        this.yAxis = this.chart.append('g')
            .attr('class', 'yAxis');

        this.xScale = d3.scaleBand().range([0, width]);
        this.yScale = d3.scaleBand().range([height, 0]);

        this.xAxis.call(d3.axisBottom(this.xScale));
        this.yAxis.call(d3.axisLeft(this.yScale))
    }

    updateChart = () => {
        this.chart.selectAll('.algorithm').remove()
        

        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);

        this.xAxis.call(d3.axisBottom(this.xScale));
        this.yAxis.call(d3.axisLeft(this.yScale))

        this.xAxis.transition(t).call(d3.axisBottom(this.xScale));
        this.yAxis.transition(t).call(d3.axisLeft(this.yScale));

        this.chart.selectAll(".algorithm")
            .data(this.kpiData)
            .enter()
            .append('g')
            .attr('class', 'algorithm')
            .selectAll('.circle')
            .data(d => {
                return d
            })
            .enter()
            .append("rect") // Uses the enter().append() method
            .attr("class", "kpiRect") // Assign a class for styling
            .attr("x", d =>
                this.xScale(d[0])
            )
            .attr("y", d => this.yScale(d[1]))
            .attr("width", this.xScale.bandwidth())
            .attr('height', this.yScale.bandwidth())
            .attr('fill', d => {
                if (d[2]) return  algColorScale(d[0])
                else return 'grey'
            })

    }

    createData = () => {
        const { stationData, truckData, kpiData, kpi, timeRange } = this.props;
        this.yDomain = Object.keys(stationData);
        this.xDomain = d3.range(kpiData.length);

        const newKpiData = kpiData.map((alg, index) => {
            let algData = {}
            this.yDomain.forEach(d => algData[d] = false)
            console.log(alg)
            const filtered = alg.filter(d => d[0] >= timeRange[0] && d[0] <= timeRange[1])
            console.log(filtered.length)
            filtered.forEach(dt => {
                dt[1].forEach(d => {
                    if (kpi === 'umd') {
                        algData[d[0]] = algData[d[0]] || d[1]['umd'] !== 0
                    }
                    else {
                        algData[d[0]] = algData[d[0]] ||  d[1][kpi]
                    }
                })
            })
            return Object.entries(algData).map(d => [index].concat(d));
        })
        this.kpiData = newKpiData;
        /*
        const newTruckData = truckData.map((alg, index) => {
            console.log(alg)
            let algData = {}
            this.yDomain.forEach(d => algData[d] = false)
            Object.values(alg).forEach(tr => {
                tr.forEach()
                const filtered = tr.filter(d => d.time >= timeRange[0] && d.time <= timeRange[1]);
                filtered.forEach(f => algData[f.station] = true)
            })

            
        })
        this.truckData = newTruckData;
        */
        
        
    }

    constructor(props) {
        super(props);
        this.myRef = React.createRef();

        this.data = [];
        this.xDomain = undefined
        this.yDomain = undefined

        this.initChart = this.initChart.bind(this);
        this.updateChart = this.updateChart.bind(this);


    }

    componentDidMount() {
        this.initChart();

    }
    componentDidUpdate() {
        this.createData()
        this.updateChart();
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextProps.timeRange)
        if (nextProps.timeRange !== undefined) {
            if (nextProps.timeRange !== this.props.timeRange) {
                return true;
            }
            if (nextProps.kpiData.length !== this.props.kpiData.length) {
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <svg id='kpi'
                width={svgWidth}
                height={svgHeight}
                ref={el => this.myRef = el}>
            </svg>
        )
    }
}

export default StationComparison;