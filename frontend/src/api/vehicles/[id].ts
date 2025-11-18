import { NextApiRequest, NextApiResponse } from 'next';

const getVehicleById = async (id: string) => {
  // Thay với logic lấy dữ liệu từ DB thực tế theo ID
  return fetch(`YOUR_BACKEND_API_URL/vehicles/${id}`)
    .then(response => response.json());
};

const updateVehicleById = async (id: string, updatedData) => {
  // Thay với logic cập nhật dữ liệu vào DB thực tế theo ID
  return fetch(`YOUR_BACKEND_API_URL/vehicles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
  .then(response => response.json());
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const vehicle = await getVehicleById(id as string);
    res.status(200).json(vehicle);
  } else if (req.method === 'PUT') {
    const updatedData = req.body;
    const updatedVehicle = await updateVehicleById(id as string, updatedData);
    res.status(200).json(updatedVehicle);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}