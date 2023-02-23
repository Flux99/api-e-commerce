import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Catalog } from './Catalog';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isSeller: boolean;

  @OneToOne(() => Catalog, catalog => catalog.seller)
  catalog: Catalog;
}



