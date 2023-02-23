import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Catalog } from './Catalog';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isSeller: boolean;

  @OneToOne(() => Catalog, catalog => catalog.seller)
  catalog: Catalog;
}



