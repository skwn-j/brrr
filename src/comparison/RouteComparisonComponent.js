// react
import React, { Component } from 'react';
//d3
import * as d3 from 'd3';
// map interaction

const svgHeight = 390;
const svgWidth = 970;
const margin = { left: 40, right: 10, top: 10, bottom: 20 }

const height = svgHeight - margin.top - margin.bottom;
const width = svgWidth - margin.left - margin.right;

const algColorScale = (i) => {
    return d3.schemeAccent[i];
}

const translate = (x, y) => {
    return 'translate(' + x + ',' + y + ')';
}

const t = d3.transition().duration(500);

class RouteComparison extends Component {

    initChart = () => {
        this.chart = d3.select(this.myRef).append('g')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'chart')
            .attr('transform', translate(margin.left, margin.top));

        this.brush = d3.brushX().extent([[0, 0], [width, height]])
            .on('brush', this.brushed)
            .on('end', this.brushEnded);

        this.xAxis = this.chart.append('g')
            .attr('class', 'xAxis').attr('transform', translate(0, height));
        this.yAxis = this.chart.append('g')
            .attr('class', 'yAxis');

        this.xScale = d3.scaleTime().range([0, width]);
        this.yScale = d3.scaleLinear().range([height, 0]);

        this.xAxis.call(d3.axisBottom(this.xScale));
        this.yAxis.call(d3.axisLeft(this.yScale))

    }

    updateChart = () => {
        this.chart.selectAll('.routeWaterfall').remove();
        this.chart.selectAll('.stationDot').remove();

        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);
        this.xAxis.transition(t).call(d3.axisBottom(this.xScale));
        this.yAxis.transition(t).call(d3.axisLeft(this.yScale));

    }


    constructor(props) {
        super(props);
        this.myRef = React.createRef();

        //initialization
        this.xDomain = undefined;
        this.yDomain = undefined;
        this.data = [];
    }
    componentDidMount() {
        this.initChart();
    }

    componentDidUpdate() {
        this.createData();
        this.updateChart();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.routeData.length !== this.props.routeData.length) {
            return true;
        }
        return false;
    }

    createData() {
        const { routeData, distanceMatrix } = this.props;
        console.log(routeData);
        console.log(distanceMatrix);
        this.xDomain = d3.extent(routeData[0][0].map(d => d.time))
        console.log(this.xDomain);
        this.yDomain =[0, d3.max(routeData.map(d => d3.max(d.map(dd => 
            d3.max(dd.map(ddd => Math.max(ddd.in, ddd.out)))))))]
        console.log(this.yDomain);

    }
    render() {
        return (
            <svg id='status-truck'
                width={svgWidth}
                height={svgHeight}
                ref={el => this.myRef = el}>
            </svg>
        )
    }
}

export default RouteComparison;