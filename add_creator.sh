#!/bin/sh
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@creatorhub.id","password":"Admin123!"}' > /tmp/auth.json

TOKEN=$(cat /tmp/auth.json | sed 's/.*"token":"\([^"]*\)".*/\1/')
echo "Auth response: $(cat /tmp/auth.json)"
echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "Login failed, trying with default password..."
  curl -s -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@creatorhub.id","password":"password"}' > /tmp/auth.json
  TOKEN=$(cat /tmp/auth.json | sed 's/.*"token":"\([^"]*\)".*/\1/')
  echo "Token: $TOKEN"
fi

echo "Creating Hijrah Saputra..."
curl -s -X POST http://localhost:3000/api/v1/creators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Hijrah Saputra","bio":"Influencer Travel","category":"travel","city":"Gampong Nusa","imageUrl":"/hijrah-saputra.jpg","platforms":[{"platform":"instagram","handle":"@hijrahheiji","followers":13662}]}'
