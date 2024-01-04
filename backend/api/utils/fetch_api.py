from api import config
import requests
import hashlib
import webbrowser
import calendar
import time

URL = "https://gateway.marvel.com:443/v1/public/characters"


def fetch_api(hero_name=None):
    gmt = time.gmtime()
    ts = calendar.timegm(gmt)

    hash = hashlib.md5((str(ts) + config.privateKey + config.publickKey).encode())

    print("HASH: ", hash)

    PARAMS = {
        "apikey": config.publickKey,
        "ts":ts,
        "hash": hash.hexdigest(),
        "name": hero_name
    }

    print("\n\nPARAMS: ", PARAMS)

    r = requests.get(url=URL, params=PARAMS)
    data = r.json()
    print("DATA: ", data)

    if len(data.get("data").get("result")):
        characterData = data.get("data").get("results")

        characterURLS = characterData[0].get("urls")

        for url in characterURLS:
            if url["type"] == "wiki":
                characterWiki = url["url"]
                break
        
        characterName = characterData[0].get("name")

        characterDesc = characterData[0].get("description")

        if characterWiki:
            webbrowser.open(characterWiki)
        elif characterName and characterDesc:
            print("Name ", characterName)
            print(characterDesc)
        else:
            print("Sem Dados")
    
    else:
        print("Sem Dados")
    
    return data
    