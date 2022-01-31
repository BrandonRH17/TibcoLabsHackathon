
API Documentation:

Getting Started:
Requirements: 

Python, NodeJS and Project AIR

Before starting you must configure Endpoints (https://tibcosoftware.github.io/labs-air/docs/userguide/configuringendpoints/) and then you must configure the data base (https://tibcosoftware.github.io/labs-air/docs/userguide/configuringendpoints/#prerequisite-3-data-store-table-setup)


The pipelines used for this API are the following:
Data Subscriber (protocol: MQTT, ProtocolID: EdgexMQTT, Topoc: edgexevents)-> Data Store (PostgreSQL) ->Data Publisher (Protocol: MQTT, ProtocolID: AIR MQTT, topic: EdgexGatewayData)

1. Install the following libraries:
	On windows:
	pip install  psycopg2
	pip install flask
	pip install flask-restful
	pip install requests
	pip install python-virtualenv

2. Download the folder available in Github
3. Extract and open de folder in Visual Studio Code
4. Install the Python extension to run the code inside Visual Studio code
5. Now the API  Service its running correctly

	
