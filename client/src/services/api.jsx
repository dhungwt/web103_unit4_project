export const getAllParks = async () => {
  const response = await fetch(`/api/parks`);
  if (!response.ok) throw new Error("Failed to fetch parks");
  return response.json();
};

export const getPark = async (id) => {
  const response = await fetch(`/api/parks/${id}`);
  if (!response.ok) throw new Error("Failed to fetch park");
  return response.json();
};

export const createPark = async (parkData) => {
  const response = await fetch(`/api/parks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parkData),
  });
  if (!response.ok) throw new Error("Failed to create park");
  return response.json();
};

export const updatePark = async (id, parkData) => {
  const response = await fetch(`/api/parks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parkData),
  });
  if (!response.ok) throw new Error("Failed to update park");
  return response.json();
};

export const deletePark = async (id) => {
  const response = await fetch(`/api/parks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete park");
  return response.json();
};
