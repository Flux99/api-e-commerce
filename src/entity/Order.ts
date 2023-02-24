
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Product } from './Product';


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyerId: number;

  @Column()
  sellerId: number;

  // @OneToMany(() => Product)
  // @JoinTable()
  // products: Product[];
  @OneToMany(() => Product, product => product.order)
  products: Product[];
}