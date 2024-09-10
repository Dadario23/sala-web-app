export const fetchBands = async () => {
  const response = await fetch("/api/bands/getBands");
  if (!response.ok) {
    throw new Error("Error fetching bands");
  }
  return response.json();
};
