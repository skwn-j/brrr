import Papa from 'papaparse';



async function readLocalFile(fileLoc) {
    const arr = await fetch(fileLoc).then(response => {
        return response.text();
    }).then(text => {
        const parsedText = Papa.parse(text, {
            complete: (res) => {
                return res.data;
            }
        })
        return parsedText.data.filter(d => d.length > 1);
    })

    let result = {};
    const head = arr[0];
    const body = arr.slice(1);
    if (head[0] === 'datetime') {
        // inventory, demand
        for (let row of body) {
            let obj = {};
            const dt = Date.parse(row[0]);
            row.forEach((d, i) => {
                if (i > 0 && head[i] !== "") {
                    obj[head[i]] = +d;
                }
            })
            result[dt] = obj;
        }
    }
    else if (head[0] === 'Truck') {
        // truck movement
        let prevLoad = 0;
        for (let i in body) {
            const [truck, load, fromTime, fromSt, toTime, toSt] = body[i];
            if (!result.hasOwnProperty(truck)) {
                result[truck] = [];
            }
            result[truck].push({
                station:fromSt,
                time: Date.parse(fromTime),
                in: prevLoad,
                out: +load,
                travel: Date.parse(toTime) - Date.parse(fromTime)
            })
            prevLoad = +load;

            if(i === body.length-1) {
                result[truck].push({
                    station:toSt,
                    time: Date.parse(toTime),
                    in: +load,
                    out: 0,
                    travel: 0
                })
            }
        }
    }
    else {
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
}

export default readLocalFile;


const haversine = ([lat1, lon1], [lat2, lon2]) => {
    // Math lib function names
    const [pi, asin, sin, cos, sqrt, pow, round] = [
        'PI', 'asin', 'sin', 'cos', 'sqrt', 'pow', 'round'
    ]
        .map(k => Math[k]),

        // degrees as radians
        [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2]
            .map(x => x / 180 * pi),

        dLat = rlat2 - rlat1,
        dLon = rlon2 - rlon1,
        radius = 6372.8; // km

    // km
    return round(
        radius * 2 * asin(
            sqrt(
                pow(sin(dLat / 2), 2) +
                pow(sin(dLon / 2), 2) *
                cos(rlat1) * cos(rlat2)
            )
        ) * 100
    ) / 100;
};