import {SearchQuery, SearchResource} from "@/types/search";
import {API_URL} from "@/lib/constants";

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
