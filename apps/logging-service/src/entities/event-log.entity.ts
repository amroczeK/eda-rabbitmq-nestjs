import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class EventLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routing_key: string;

  @Column()
  exchange: string;

  @Column()
  status: string;

  @Column('text')
  payload: string;

  @Column('text')
  error_message: string;

  @CreateDateColumn()
  created_at: Date;
}
