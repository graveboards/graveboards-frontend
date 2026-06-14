import "server-only";

export const SERVER_API_URL = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://graveboards-backend:8000/api/v1"
).replace(/\/$/, "");
