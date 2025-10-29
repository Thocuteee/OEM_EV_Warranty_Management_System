// types/index.ts

export type CarStatus = 'Đang hoạt động' | 'Trong bảo hành' | 'Ngừng hoạt động';

export interface Car {
    id: number;
    vin: string;
    model: string;
    year: number; // Thêm trường year
    customerName: string;
    customerId: string;
    registrationDate: string; // Định dạng YYYY-MM-DD
    status: CarStatus;
    batterySerial: string;
    notes: string;
}

// Kiểu dữ liệu cho bộ lọc
export interface CarFilter {
    vin: string;
    model: string;
    customer: string;
    year: string;
}