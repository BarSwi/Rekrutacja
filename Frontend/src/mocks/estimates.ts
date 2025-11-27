import { Estimate, ItemType, Unit } from "../types";

//Setup pod API
export const mockEstimates: Estimate[] = [
  {
    id: "1",
    name: "Remont łazienki",
    createdAt: new Date("2025-11-20"),
    items: [
      {
        id: "item-1",
        estimateId: "1",
        type: ItemType.MATERIAL,
        name: "Cegła Porotherm 25",
        quantity: 12000,
        unit: Unit.PCS,
        unitPrice: 3.2,
        totalPrice: 38400,
      },
      {
        id: "item-2",
        estimateId: "1",
        type: ItemType.SERVICE,
        name: "Malowanie ścian g/k (2x)",
        totalPrice: 22000,
      },
      {
        id: "item-3",
        estimateId: "1",
        type: ItemType.MATERIAL,
        name: "Glazura ścienna",
        quantity: 50,
        unit: Unit.SQM,
        unitPrice: 7500,
        totalPrice: 375000,
      },
    ],
  },
];
