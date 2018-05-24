const { EventHubClient, isIotHubConnectionString } = require('azure-event-hubs');


async function retrievePartitions(hubConnectionString, entityName) {
    if(isIotHubConnectionString(hubConnectionString)) {
        // Treat it as iot hub connection string
        console.log('Using as IoT hub connection string');
        
        if(entityName.length == 0) {
            entityName = 'messages/events';
        }

        // Prepend "EntityName="
        const hubCSWithEntityName = "EntityPath=" + entityName + ";" + hubConnectionString;
        const client = await EventHubClient.createFromIotHubConnectionString(hubConnectionString);
        return await retrievePartition(client);
    } else {
        // Treat it as event hub connection string
        console.log('Using as Event hub connection string');
        const client = EventHubClient.createFromConnectionString(hubConnectionString, entityName);
        return await retrievePartition(client);
    }
}

async function retrievePartition(client) {
    try {
        const partitionIds = await client.getPartitionIds();
        console.log("Partition id: ", partitionIds);
        return partitionIds;
    } catch (e) {
        console.log("An error occurred: ", e.message);
        return [];
    }
}

export default retrievePartitions;