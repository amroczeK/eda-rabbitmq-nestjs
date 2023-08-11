import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  product_name: string;

  @Column({ type: 'numeric' })
  quantity: number;

  @Column({ type: 'numeric' })
  price: number;
}
