import { CreateInventoryDto } from './create-inventory.dto';

// All fields become optional using Partial<T>
export type UpdateInventoryDto = Partial<CreateInventoryDto> & {
  id: number;
};
