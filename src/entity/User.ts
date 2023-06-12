import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { Profile } from "./Profile"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  username: string

  @Column()
  age: number
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile
}