import { NextApiRequest, NextApiResponse } from 'next';

// Giả sử backend của bạn có hàm này
const getVehiclesFromDB = async () => {
  return fetch('https://api.yoursite.com/vehicles')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    });
};

const addVehicleToDB = async (newVehicle) => {
  // Thay với logic thêm dữ liệu vào DB thực tế
  return fetch('YOUR_BACKEND_API_URL/vehicles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newVehicle),
  })
  .then(response => response.json());
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const vehicles = await getVehiclesFromDB();
    res.status(200).json(vehicles);
  } else if (req.method === 'POST') {
    const newVehicle = req.body;
    const createdVehicle = await addVehicleToDB(newVehicle);
    res.status(201).json(createdVehicle);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}