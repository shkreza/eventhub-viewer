import { Writable, Transform } from "stream";

const { Writeable } = require('stream');
const { EventHubClient, EventPosition, isIotHubConnectionString } = require('azure-event-hubs');

function useClientToSendData(eventHubClient, startTimestamp, partitionName, w: Transform) {
    var latest_marker = startTimestamp || Date.now();

    const receiveMore = function() {
        const promise = eventHubClient.receiveBatch(partitionName,
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
}

async function retrieveEvents(hubConnectionString, entityName, startTimestamp, partitionName, w: Transform) {
    
    if(isIotHubConnectionString(hubConnectionString)) {
        const client = await EventHubClient.createFromIotHubConnectionString(hubConnectionString);
        useClientToSendData(client, startTimestamp, partitionName, w);
    } else {
        const client = EventHubClient.createFromConnectionString(hubConnectionString, entityName);
        useClientToSendData(client, startTimestamp, partitionName, w);
    }
};

export default retrieveEvents;