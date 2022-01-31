
import classes
import random
import requests
import hashlib
import datetime
from flask import Flask, request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

#Inicialize the class
ethereum = classes.Ethereum()

class getData(Resource):

    #Get Data to send for Ethereum Network
    def get(self):
        x        = 0
        data     = ethereum.get_data('readings_string')
        response = {}
        for i in data: 

          try:

            json_data = ethereum.string_to_json(i[5])
            walletID         = json_data['walletID']
            minner_id        = json_data['minerID']
            date             = str(i[1])
            hash_value       = json_data['hash']
            miningfee        = random.randrange(1,5)

            response[str(x)] = ethereum.etherem_json(walletID, minner_id, hash_value, date, miningfee)
            x += 1
          except:
              print("Error to get information")

        return response
  

class insert(Resource):
    #Post data to project AIR
    def post(self):
      #  Extract all values from json incoming
        try:
            minnerID = request.json['minnerID']
            walletID = request.json['walletID']
            gps      = request.json['gps']
            c02      = request.json['co2_data']
            o3       = request.json['o3_data']
            no2      = request.json['no2_data']
            hum      = request.json['hum_data']
            temp     = request.json['temp_data']
        except:
            #if the parameteres are wrong print and return error
            return {'error': True, 'message': 'Bad Json'}

        milliseconds = datetime.datetime.now().timestamp() * 1000
        hash_params = walletID+minnerID+str(milliseconds)
        hash_value  = hashlib.sha1(hash_params.encode())
        hash_result = hash_value.hexdigest()

        #Prepare the connection to project air    
        url = 'http://localhost:49565/api/v1/resource/RESTDevice/str_reading'

        #String to Insert
        send = '_minerID_:{},_walletID_:{},_hash_:{},_gps_:{},_CO2_:{},_O3_:{},_NO2_:{},_HUM_:{},_TEMP_:{}'.format(minnerID, walletID, hash_result, gps, c02, o3, no2, hum, temp)
  
        try:
            #Record send succesfuly
            requests.post(url, data=send)
            return {'error': False, 'message': 'Record send to project AIR'}
        except:
            #If the data can't send return error in response
            return {'error': True, 'message': 'Failed to send data to project air'}



api.add_resource(getData, '/ethereum')  # Route_1
api.add_resource(insert, '/postData')  # Route_2


if __name__ == '__main__':
     app.run(port='8000')


