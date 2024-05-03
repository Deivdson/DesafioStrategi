import hashlib, ssl, urllib3
import requests
from decouple import config

class SslOldHttpAdapter(requests.adapters.HTTPAdapter):
    def init_poolmanager(self, connections, maxsize, block=False):
        ctx = ssl.create_default_context()
        ctx.set_ciphers('DEFAULT@SECLEVEL=1')

        self.poolmanager = urllib3.poolmanager.PoolManager(
            ssl_version=ssl.PROTOCOL_TLS,
            ssl_context=ctx)

def compute_md5_hash(my_string):
    # m= hashlib.new('md5', usedforsecurity=False)
    m = hashlib.md5(usedforsecurity=False)
    m.update(my_string.encode('utf-8'))
    return m.hexdigest()

def make_authorization():
    publickKey = config('PUBLIC_KEY')
    privateKey = config('PRIVATE_KEY')
    ts = 1
    md5_hash = compute_md5_hash(f'{ts}{privateKey}{publickKey}')
    query_params = f'&ts={ts}&apikey={publickKey}&hash={md5_hash}'
    return query_params

def fetch_api(url):
    url += make_authorization()
    print('\n\n--------------------')
    s = requests.session()
    s.mount(url, SslOldHttpAdapter())

    response = s.get(url)

    caracters = response.json()['data']['results']
    return (caracters, response.json()['data']['count'])