from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

class VisitorCounter:
    @staticmethod
    async def increment_visit():
        """
        Increment the total visit counter
        """
        result = await db.visitor_stats.find_one_and_update(
            {"_id": "global_counter"},
            {
                "$inc": {"total_visits": 1},
                "$set": {"last_visit": datetime.now(timezone.utc)}
            },
            upsert=True,
            return_document=True
        )
        return result.get("total_visits", 0) if result else 0
    
    @staticmethod
    async def get_total_visits():
        """
        Get the total number of visits
        """
        result = await db.visitor_stats.find_one({"_id": "global_counter"})
        return result.get("total_visits", 0) if result else 0
    
    @staticmethod
    async def get_stats():
        """
        Get visitor statistics
        """
        result = await db.visitor_stats.find_one({"_id": "global_counter"})
        if not result:
            return {
                "total_visits": 0,
                "last_visit": None
            }
        return {
            "total_visits": result.get("total_visits", 0),
            "last_visit": result.get("last_visit")
        }
