import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, RelationId } from "typeorm";
import User from "./User";

@Entity('easy_password')
export default class EasyPassword {
  @PrimaryColumn({ name: 'idx' })
  idx!: string;

  @Column({ name: 'easy_password' })
  easyPassword!: string;

  @RelationId((easyPassword: EasyPassword) => easyPassword.user)
  userId!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @OneToOne(type => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;
}