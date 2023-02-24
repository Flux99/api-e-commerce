import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Catalog } from './Catalog';
import { Order } from './Order';




@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  name: string;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => Catalog, catalog => catalog.id)
  catalog: number;
  @ManyToOne(() => Order, order => order.id)
  order: number;
}