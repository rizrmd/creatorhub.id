#!/usr/bin/env python3
import json
import urllib.request

print("Downloading GADM data...")
url = "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_IDN_2.json"
req = urllib.request.urlopen(url)
data = req.read()
print(f"Downloaded {len(data)} bytes")

geo = json.loads(data)
print(f"Total features: {len(geo['features'])}")

jakarta = [ft for ft in geo['features'] if 'Jakarta' in str(ft['properties'].get('NAME_1', ''))]
print(f"Jakarta features: {len(jakarta)}")

for ft in jakarta:
    n = ft['properties'].get('NAME_2', '?')
    g = ft['geometry']
    pts = 0
    if g['type'] == 'Polygon':
        pts = len(g['coordinates'][0])
    elif g['type'] == 'MultiPolygon':
        pts = sum(len(ring[0]) for ring in g['coordinates'])
    print(f"  {n}: {g['type']}, {pts} points")

out = {'type': 'FeatureCollection', 'features': jakarta}
with open('/tmp/jakarta-detailed.geo.json', 'w') as f:
    json.dump(out, f)
print("Saved to /tmp/jakarta-detailed.geo.json")
