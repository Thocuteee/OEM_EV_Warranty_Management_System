export interface PartSerialRequest {
    id?: number;
    partId: number;
    serialNumber: string; 
    dateReceived: string; 
}

export interface PartSerialResponse {
    id: number;
    serialNumber: string;
    dateReceived: string; 
    partId: number;
    partNumber: string;
    partName: string;
}