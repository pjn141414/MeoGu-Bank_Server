import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import User from "./User";

@Entity('easy_password')
export default class EasyPassword {
  @PrimaryColumn({ name: 'idx' })
  idx!: number;

  @Column({ name: 'easy_password' })
  easyPassword!: string;

  @RelationId((user: User) => user.id)
  userId!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @OneToOne(type => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;
}