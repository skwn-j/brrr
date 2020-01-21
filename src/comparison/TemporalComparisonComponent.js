// react
import React, { Component } from 'react';
//d3
import * as d3 from 'd3';
// map interaction

const svgHeight = 290;
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

const kpiDomains = ['umd', 'zvt', 'fpt', 'trf']

class TemporalComparison extends Component {

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
        this.chart.selectAll('.brush').remove();
        this.chart.selectAll('.kpiLines').remove();
        this.chart.selectAll('.kpiDots').remove();

        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);
        this.xAxis.transition(t).call(d3.axisBottom(this.xScale));
        this.yAxis.transition(t).call(d3.axisLeft(this.yScale));



        const line = d3.line()
            .x(d => {
                return this.xScale(d[0])
            }) // set the x values for the line generator
            .y(d => this.yScale(d[1])) // set the y values for the line generator 

        console.log(this.data);
        this.chart.selectAll('.kpiLines')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'kpiLines')
            .append("path")
            .datum(d => {
                return d;
            }) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line) // 11. Calls the line generator 
            .style('fill', 'none')
            .style('stroke', (d, i) => {
                return algColorScale(i);
            })
            .style('stroke-width', 2)
            .on('mouseover', d => {
                console.log(d)
            })

        // 12. Appends a circle for each datapoint 
        this.chart.selectAll(".kpiDots")
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'kpiDots')
            .selectAll('.circle')
            .data(d => d)
            .enter()
            .append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", d => this.xScale(d[0]))
            .attr("cy", d => this.yScale(d[1]))
            .attr("r", 3);

        this.coverage = this.xScale.range();
        //this.interval = (this.coverage[1] - this.coverage[0]) / (Math.max(this.kpiData[0].length, this.kpiData[1].length) - 1);
        /*
        this.chart.append('g')
            .attr('class', 'brush')
            .style('opacity', 0.6)
            .call(this.brush)
            .call(this.brush.move, this.coverage);
            */
    }
    /*
    brushed = () => {
        // selection event
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        let s = d3.event.selection || [0, width];
        const { selectTimeRange } = this.props;

        // if there are no changes in coverage
        const rounded = s.map(d => Math.round(d / this.interval) * this.interval);
        if (rounded[0] === this.coverage[0] && rounded[1] === this.coverage[1]) {
            return
        }
        else {
            //selectTimeRange(rounded.map(d => Date.parse(this.xScale.invert(d))))
        }
        this.coverage = rounded
    }

    brushEnded = () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        let s = d3.event.selection || [0, width];
        const { selectTimeRange } = this.props;

        const rounded = s.map(d => Math.round(d / this.interval) * this.interval);
        if (s[0] === rounded[0] && s[1] === rounded[1]) {
            selectTimeRange(rounded.map(d => Date.parse(this.xScale.invert(d))))
            this.coverage = rounded
        }
        else {
            this.chart.select('.brush').call(this.brush.move, rounded)
        }
    }
    */
    constructor(props) {
        super(props);
        this.myRef = React.createRef();

        //initialization
        this.xDomain = undefined;
        this.yDomain = undefined;
        this.data = []
    }
    componentDidMount() {
        this.initChart();
    }

    componentDidUpdate() {
        this.createData();
        this.updateChart();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.kpiData.length !== this.props.kpiData.length) {
            console.log('no')
            return true;
        }
        if(nextProps.kpiDomain !== this.props.kpiDomain) {
            return true;
        }
        if(nextProps.accumulate !== this.props.accumulate) {
            return true;
        }
        return false;
    }

    createData() {
        const { kpiData, kpiDomain, accumulate} = this.props;

        console.log(kpiData);

        if (kpiData.length !== 0) {
            if(accumulate) {
                const newData = kpiData.map(alg => {
                    let algData = [];
                    let h = 0;
                    alg.forEach(d => {
                        if (kpiDomain === 'umd') {
                            h = d[1].reduce((acc, curr) => curr[1]['umd'] + acc, 0);
                            
                        }
                        else {
                            h = d[1].filter(curr => curr[1][kpiDomain] === true).length;
                        }
                        algData.push([d[0], h])
                    })
                    return algData;
                })
                this.data = newData;
            }
            else {
                const newData = kpiData.map(alg => {
                    let algData = [];
                    let h = 0;
                    alg.forEach(d => {
                        if (kpiDomain === 'umd') {
                            h = d[1].reduce((acc, curr) => curr[1]['umd'] + acc, 0);
                            
                        }
                        else {
                            h = d[1].filter(curr => curr[1][kpiDomain] === true).length;
                        }
                        algData.push([d[0], h])
                    })
                    return algData;
                })
                this.data = newData;
            }
        }
        
        this.xDomain = d3.extent(this.data[0].map(d => d[0]));
        this.yDomain = [0, d3.max(this.data.map(d => d3.max(d.map(dd => dd[1]))))]
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

export default TemporalComparison;