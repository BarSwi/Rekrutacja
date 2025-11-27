export enum ItemType {
  MATERIAL = "material",
  SERVICE = "service",
}

export enum Unit {
  PCS = "pcs",
  SQM = "sqm",
  CUBM = "cubm",
  MB = "mb",
  KG = "kg",
  BAG = "bag",
}

export interface Estimate {
  id: string;
  name: string;
  createdAt: Date;
  total: number;
}

export interface EstimateItem {
  id: string;
  estimateId: string;
  type: ItemType;
  name: string;
  quantity?: number;
  unit?: Unit;
  unitPrice?: number;
  totalPrice: number;
}

export interface Material extends EstimateItem {
  type: ItemType.MATERIAL;
  quantity: number;
  unit: Unit;
  unitPrice: number;
}

export interface Service extends EstimateItem {
  type: ItemType.SERVICE;
  totalPrice: number;
}

export interface CreateEstimatePayload {
  name: string;
}

export interface CreateMaterialPayload {
  name: string;
  quantity: number;
  unit: Unit;
  unitPrice: number;
}

export interface CreateServicePayload {
  name: string;
  totalPrice: number;
}

export interface UpdateEstimateNamePayload {
  name: string;
}
