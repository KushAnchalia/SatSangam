#!/bin/bash
# Script to clear all events from the database

echo "🗑️  Clearing all events from Satsangam database..."

API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

if [ -z "$API_URL" ]; then
    echo "❌ Error: Could not find API URL"
    exit 1
fi

response=$(curl -s -X POST "$API_URL/api/admin/clear-all-events")

echo "$response" | python3 -c "
import sys
import json
try:
    data = json.load(sys.stdin)
    if 'message' in data:
        print('✅ ' + data['message'])
        print('📊 Events deleted: ' + str(data.get('events_deleted', 0)))
        print('📊 Registrations deleted: ' + str(data.get('registrations_deleted', 0)))
        print('📊 Payments deleted: ' + str(data.get('payments_deleted', 0)))
    else:
        print('❌ Error: ' + str(data))
except:
    print('❌ Failed to parse response')
"

echo "🎉 Database cleared!"
