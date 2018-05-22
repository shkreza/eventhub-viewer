const { EventHubClient } = require('azure-event-hubs');


async function retrievePartitions(hubConnectionString, entityName) {
    const client = EventHubClient.createFromConnectionString(hubConnectionString, entityName);

    try {
        const partitionId = await client.getPartitionIds();
        console.log("Partition id: ", partitionId);
        return partitionId;
    } catch (e) {
        console.log("An error occurred: ", e.message);
    }
}

export default retrievePartitions;