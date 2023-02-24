import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Entity()
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @OneToOne(() => User, user => user.id)
  // seller: number;

  @OneToMany(() => Product, product => product.catalog)
  products: Product[];
}