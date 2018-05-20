export function getSomeJsonData(randomMarker, count=100) {
    var e = {"name": "reza"};
    var data = new Array(count).fill(0).map((x, y)=> {
                    e["index"] = y;
                    return JSON.stringify(e) + randomMarker
    }).join('');
    return data;
}

export function getRandomMarker(length=10) {
    return [
        '####',
        new Array(length).fill('.').map(() => Math.floor((Math.random()*10))).join(''),
        '####'].join('');
}

export class JSONIncrementalSerializer {
    randomMarker: string;

    constructor(randomMarker) { this.randomMarker = randomMarker; }

    convertToMarkedDataBuffers(data, maxBufferSize=5) {
        var split_data = []
          , split_loc = 0;
        while(split_loc < data.length) {
            var remaining = data.length - split_loc;
            var x = Math.max(Math.min(Math.floor(Math.random() * remaining), maxBufferSize), 1);
            split_data.push(data.substr(split_loc, x));
            split_loc += x;
      }
  
      return split_data;
    }
}

export class JSONIncrementalDeserializer {
    incompleteBuffer: string;
    randomMarker: string;
    
    constructor(randomMarker) {
        this.incompleteBuffer = '';
        this.randomMarker = randomMarker;
    }

    newDataReceived(newData) {
        var completedSegments = [];
        var segments = [this.incompleteBuffer, newData].join('').split(this.randomMarker);
        for(var i=0; i<segments.length-1 ;i++) {
            completedSegments.push(JSON.parse(segments[i]));
        }
        
        this.incompleteBuffer = segments[segments.length-1];
    
        return completedSegments;
    }
}

function runTest() {
    // Construct data buffer
    const randomMarker = getRandomMarker(10);
    var data = getSomeJsonData(randomMarker, 100);

    // Serialize and transfer
    var serializer = new JSONIncrementalSerializer(randomMarker);
    var transferBuffers = serializer.convertToMarkedDataBuffers(data, 5);

    // Recover JSON
    var deserializer = new JSONIncrementalDeserializer(randomMarker);
    var recoveredJsonSegments = transferBuffers
        .map(buffer => { return deserializer.newDataReceived(buffer); })
        .filter(array => array.length > 0)
        .map(jsonStr => JSON.stringify(jsonStr));
    console.log(recoveredJsonSegments.join('\n'));
}

// runTest();

/*

const transferredDataSegments = createMarkedSegmentedDataArray();
// transferredDataSegments.map(x => console.log(x));

function recoverDataSegments(randomMarker, lastBuffer) {
    var completedSegments = [];
    var segments = lastBuffer.split(randomMarker);
    for(var i=0; i<segments.length-1 ;i++) {
        completedSegments.push(segments[i]);
    }
    var incompleteBuffer = segments[segments.length-1];

    return [completedSegments, incompleteBuffer];
}


function createMarkedSegmentedDataArray() {
    var split_data = []
      , split_loc = 0;
    while(split_loc < data.length) {
        var remaining = data.length - split_loc;
        var x = Math.max(Math.min(Math.floor(Math.random() * remaining), 5), 1);
        split_data.push(data.substr(split_loc, x));
        split_loc += x;
    }

    return split_data;
}

var transferBuffer = '';
transferredDataSegments.forEach(segment => {
    transferBuffer += segment;
    var [completedSegments, incompleteBuffer] = recoverDataSegments(randomMarker, transferBuffer);
    
    (completedSegments as [string]).forEach(segment => {
        const d = JSON.parse(segment);
        console.log("Completed segment: " + JSON.stringify(d));
    });

    transferBuffer = incompleteBuffer as string;
});

*/

/*
var buffer = '';
var recovered = [];
transferredDataSegments.forEach(function(x) {
    buffer += x;
    var splt = buffer.split(randomMarker);
    for(var i=0; i<splt.length-1 ;i++) {
        recovered.push(JSON.parse(splt[i]));
    }
    buffer = splt[splt.length-1];
})
recovered.push(JSON.parse(buffer));

recovered.map((x, y) => console.log(y, '-', x));

function f() {
    var s1 = JSON.stringify({"name": "reza"});
    var s2 = JSON.stringify({"name": "roya"});
    var ss = s1 + s2;

    var s3 = ss.substring(0, 10);
    var s4 = ss.substring(10, ss.length);

    var sss = s3 + randomMarker + s4;
    var ssss = null;
    var loc = sss.indexOf(randomMarker, 0)
    if(loc >= 0) {
        ssss = sss.substr(0, loc) + ":" + sss.substr(loc+randomMarker.length);
    } else {
        ssss = ">" + sss + "<<<"
    }

    return ssss;
}
*/

// var result = f();
// console.log(data);
