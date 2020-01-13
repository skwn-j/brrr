/// app.js
import React, { Component } from 'react';
// deck.gl
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers'
import { TripsLayer } from '@deck.gl/geo-layers';
import { WebMercatorViewport } from '@deck.gl/core';

import ReactMapGl from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
// d3
import * as d3 from 'd3';
// custom layers
// Constants 
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWluaW11cyIsImEiOiJjanVpMXQ5ZGMxNjQ4NGZwZzA5eXF5N3lsIn0.R_H6mD12p7_M0RcjKjSHnw';
const INITIAL_VIEW_STATE = {
    longitude: 126.925827,
    latitude: 37.525071,
    zoom: 13,
    maxZoom: 18,
    pitch: 0,
    bearing: 0
};

const width = 610;
const height = 400;


// Truck layer color scheme
const schemeAccentDeck = (i) => {
    const color = d3.schemeAccent[i];
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return [r, g, b, 255]
}

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewState: Object.assign({}, INITIAL_VIEW_STATE)
        };
        //this._onViewStateChange = this._onViewStateChange.bind(this);
    }
    updateLayers = () => {
        const { stationData } = this.props;
        //set focus
        this.stationLayer = new ScatterplotLayer({
            id: 'stationLayer',
            data: Object.values(stationData),
            pickable: true,
            filled: true,
            lineWidthScale: 10,
            radiusScale: 10,
            radiusMinPixels: 1,
            getPosition: d => d.coords,
            getRadius: 3,
            getLineWidth: 0.5,
            getFillColor: d => {
                return [255, 0, 0]
            }
        });

        //const startTime = +Object.keys(truckData[0])[0]
        /*
        let tripsData = this.createTripsData(startTime);
        console.log(tripsData);
        console.log(startTime)
        this.truckLayer = new TripsLayer({
            id: 'truckLayer',
            data: Object.values(truckData),
            getPath: d => {
                console.log(d.map(p => (p.timestamp - startTime)/600000))
                return d.map(p => p.coords)
            },
            getTimestamps: d => d.map(p => (p.timestamp - startTime)/600000),
            currentTime: 1,
            trailLength: 1,
            getColor: [253, 128, 93],
            widthMinPixels: 3,
            opacity: 1
        })
        */

    }

    /*
    _sortStations() {
        const { stationData, setStationOrder } = this.props;
        //set focus
        const viewport = new WebMercatorViewport(this.state.viewState);
        stationData.sort((a, b) => {
            return viewport.project(a.coords)[0] - viewport.project(b.coords)[0]
        })
        setStationOrder(stationData.map(d => d.id))
    }
    
    _onViewStateChange({ viewState }) {
        this.setState({ viewState });
        this._sortStations();
    }
    */

    createTripsData = (startTime) => {
        const { stationData, truckData } = this.props;
        const interval = 60000;

        let tripsData = [];
        Object.values(truckData).forEach((tr, tri) => {
            tripsData.push([]);
            Object.values(truckData[0]).forEach((d, i) => {
                const { fromSt, fromTime, toSt, toTime, load } = d;
                const fromCoords = stationData[fromSt].coords;
                const toCoords = stationData[toSt].coords;
                /*
                const timediff = toTime - fromTime;
                for (let i = 0; i < timediff / interval; i++) {
                    tripsData[tri].push({
                        coords: fromCoords.map((fc, j) => ((timediff - interval * i) * fc + interval * i * toCoords[j]) / timediff),
                        timestamp: fromTime + interval*i,
                        load
                    })
                }
                */

                if (startTime === fromTime) {
                    tripsData[tri].push({
                        coords: fromCoords,
                        timestamp: fromTime,
                        load
                    })
                }
                tripsData[tri].push({
                    coords: toCoords,
                    timestamp: toTime,
                    load
                })
            })
        })
        return tripsData;
    }
    componentDidMount() {
        //this._sortStations();
    }

    componentDidUpdate() {
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.stationData !== this.props.stationData) {
            return true;
        }

        return false;
    }

    render() {
        
        const { viewState } = this.state;
        const { controller = true, baseMap = true, stationData } = this.props;
        if(stationData !== undefined) {
            this.updateLayers();
        }
    
        return (
            <DeckGL
                container={'map'}
                layers={[this.stationLayer]} // ,this.arrowLayer]}
                width={width}
                height={height}
                initialViewState={viewState}
                controller={controller}

            //onViewStateChange={this._onViewStateChange}
            >
                {baseMap && (
                    <ReactMapGl
                        reuseMaps
                        mapStyle="mapbox://styles/mapbox/dark-v9"
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}>

                    </ReactMapGl>
                )}
            </DeckGL>
        )
    }
}

export default Map;