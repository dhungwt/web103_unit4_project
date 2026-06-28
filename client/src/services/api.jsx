const API_BASE_URL = "http://localhost:3000";

// GET all parks
export const getAllParks = async () => {
  const response = await fetch(`${API_BASE_URL}/parks`);
  if (!response.ok) throw new Error("Failed to fetch parks");
  return response.json();
};

// GET single park by id
export const getPark = async (id) => {
  const response = await fetch(`${API_BASE_URL}/parks/${id}`);
  if (!response.ok) throw new Error("Failed to fetch park");
  return response.json();
};

// POST create new park
export const createPark = async (parkData) => {
  const response = await fetch(`${API_BASE_URL}/parks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parkData),
  });
  if (!response.ok) throw new Error("Failed to create park");
  return response.json();
};

// PUT update existing park
export const updatePark = async (id, parkData) => {
  const response = await fetch(`${API_BASE_URL}/parks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parkData),
  });
  if (!response.ok) throw new Error("Failed to update park");
  return response.json();
};

// DELETE park
export const deletePark = async (id) => {
  const response = await fetch(`${API_BASE_URL}/parks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete park");
  return response.json();
};
