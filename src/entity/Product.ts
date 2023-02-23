import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Catalog } from './Catalog';




@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => Catalog, catalog => catalog.products)
  catalog: Catalog;
}