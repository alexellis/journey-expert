import datetime
import os
import json
import datetime
import requests

def handle(st):
    req = json.loads(st)
    stamp = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ')
    
    req["@timestamp"] = stamp

    es_url = os.getenv("es_url")
    
    print(es_url, stamp, st)

    r = requests.post(es_url, json=req)
    print(str(r.status_code))

