import { Writable, Transform } from "stream";

const { Writeable } = require('stream');
const { EventHubClient, EventPosition } = require('azure-event-hubs');

function retrieveEvents(hubConnectionString, entityName, startTimestamp, partitionName, w: Transform) {
    const client = EventHubClient.createFromConnectionString(hubConnectionString, entityName);

    var latest_marker = startTimestamp || Date.now();

    const receiveMore = function() {
        const promise = client.receiveBatch(partitionName,
                                            10,
                                            1,
                                            {
                                                eventPosition: EventPosition.fromEnqueuedTime(latest_marker)
                                            });
        promise.then((datas) => {
            w.write(datas, receiveMore);
            datas.forEach(event => {
                if(event.enqueuedTimeUtc > latest_marker) { latest_marker = event.enqueuedTimeUtc; }
            });
        })
    };

    receiveMore();
};

export default retrieveEvents;