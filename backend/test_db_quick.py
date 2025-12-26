"""Quick database connection test"""
import asyncio
from app.infrastructure.database.base import engine

async def test():
    try:
        async with engine.connect() as conn:
            print("[OK] Database connection works!")
            return True
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test())
    exit(0 if result else 1)

