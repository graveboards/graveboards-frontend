import {SearchQuery, SearchResource} from "@/types/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("Please define NEXT_PUBLIC_API_URL in .env.local");
}

// TODO: Add a cancellation token to the fetch request
export const getSearchResource = async (query: SearchQuery) => {
    const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
        cache: "no-store",
    })

    if (!response.ok)
        throw new Error("Failed to get a search resource");

    return await response.json() as SearchResource;
}