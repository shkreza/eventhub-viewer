# EventHub Web Viewer
This open source project helps view/inspect your events sent to Azure EventHub/IoTHub.

A live version of this viewer is available [here](http://eventhub.shkreza.com).

## To use the deployed version
1. Open http://eventhub.shkreza.com in your browser.
2. Enter your Eventhub's information:
  * Your hub connection string (with _listener_ permission);
  * Your hub's entity name;
  * The start time for initial events to receive (click "Select now" button to enter current timestamp).
  * Your partition name (you can query paritions by clicking "List partitions").
  
   For IoT Hub, use [this instructions](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messages-read-builtin#read-from-the-built-in-endpoint) to retrieve Event Hub-compatible connection strings.
  
3. To start receiving events, click "Start streaming" button.
4. To stop, click "Stop streaming" button.

![EventHub Viewer](./docs/images/web.PNG)

## To build locally
1. Clone the code with `git clone https://github.com/shkreza/eventhub-viewer.git`
2. Install TypeScript (see instructions [here](https://code.visualstudio.com/docs/languages/typescript)).
3. Compile the typescript files in `lib/` folder (this produces `.js` files under `dist/`)
  ```
  tsc
  ```

## To run locally (HTTP only)
1. Run:
  ```
  node dist/server.js
  ```
2. Open `http://localhost:4444` in your browser.

## To build as docker image
1. Compile typescript files:
  ```
  tsc
  ```
  This places compiled `.js` files under `dist/` folder.
  
2. Build docker image:
  ```
  docker build -t <YOUR_IMAGE_NAME> .
  ```
  A latest version of eventhub viewer is already pushed to `shkreza/eventhub-viewer` in [DockerHub](https://hub.docker.com/r/shkreza/eventhub-viewer/).

3. To run:
  ```
  docker run -p 4444:4444 <YOUR_IMAGE_NAME>
  ```

4. Open `http://<DOCKER_HOST>:4444` in your browser (the service routes port `80` to your container's port `4444`).

## To deploy in Kubernetes (HTTPS)
Assuming you have already build and pushed the docker image:
1. Add your site certitifates as TLS secrets in Kubernetes:
  ```
  kubectl create secret tls tls-secret --key=tls.key --cert=tls.crt
  ```
2. Update `kubernetes/deployment.yaml` with `YOUR_IMAGE_NAME`:
  ```yaml
      spec:
        containers:
        - name: eventhub-viewer
          image: <YOUR_IMAGE_NAME>
  ```
3. Deploy Kubernetes container:
  ```
  kubectl create -f kubernetes/deployment.yaml
  ```
4. Deploy Kubernetes service (loadbalancer):
  ```
  kubectl create -f kubernetes/service.yaml
```
5. Check your services' external IP:
6. Deploy Kubernetes container
  ```
  kubectl get service eventhub-viewer
  ```
7. Open `https://<YOUR_SERVIE_EXTERNAL_IP>` in your browser.


