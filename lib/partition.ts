const { EventHubClient } = require('azure-event-hubs');


async function retrievePartitions(hubConnectionString, entityName) {
    // process.env['EVENTHUB_CONNECTION_STRING'], process.env['EVENTHUB_NAME']
    const client = EventHubClient.createFromConnectionString(hubConnectionString, entityName);

    try {
        const partitionId = await client.getPartitionIds();
        console.log("Partition id: ", partitionId);
        return partitionId;
    } catch (e) {
        console.log("An error occurred: ", e.message);
    }
}

// const pIds = main();
// console.log("All paritition Id's are: " + pIds);

export default retrievePartitions;