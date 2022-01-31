import psycopg2
import json

class Ethereum:

    #Connection to AWS
    def __init__(self):
        try:
            self.conn = psycopg2.connect(user="postgres",
                                         password="gert1234",
                                         host="postgresql.cmiumhf1p4iz.us-east-1.rds.amazonaws.com",
                                         port="5432")
            print("Connection Stablished")
            self.cur = self.conn.cursor()
        except:
            print("Connection to AWS Fail")

    #Extract the data from table
    def get_data(self, table):
        self.cur.execute("SELECT * FROM {}".format(table))
        rows = self.cur.fetchall()
        return rows

    #This function hash the walletID, date and miningFee parameters and return json
    def etherem_json(self, walletID, minerID, hash, date, miningFee):
        ethereum = {}

        ethereum['walletID']  = walletID
        ethereum['minerID']   = minerID
        ethereum['hash']      = hash
        ethereum['date']      = date
        ethereum['miningFee'] = miningFee
        
        return ethereum


    #Convert string to Json 
    def string_to_json(self, string):
        response = string.replace('_', '"')
        add      =  '{'+response
        add_1    = add+'"}'
        result = add_1.replace(':', ':"').replace(',', '",')
        return json.loads(result)

    #Close connection
    def __del__(self):
        self.conn.close()

##------------------------END class----------------------------------------------------------------
