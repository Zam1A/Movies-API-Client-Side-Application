export const OMDB_API_URL = "https://www.omdbapi.com/";

export const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY || "";

export const requestOmdb = async (params) => {
  if (!OMDB_API_KEY) {
    return {
      error: true,
      message: "Set REACT_APP_OMDB_API_KEY to load movie data from OMDb.",
    };
  }

  const query = new URLSearchParams({
    apikey: OMDB_API_KEY,
    r: "json",
  });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  try {
    const response = await fetch(`${OMDB_API_URL}?${query.toString()}`);
    const data = await response.json();

    if (!response.ok || data.Response === "False") {
      return {
        ...data,
        error: true,
        status: response.status,
        message: data.Error || response.statusText || "Request failed",
      };
    }

    return data;
  } catch (error) {
    return {
      error: true,
      message: "Could not reach OMDb. Please check your internet connection.",
    };
  }
};
