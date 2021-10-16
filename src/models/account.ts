import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import Receive from "./receive";
import Send from "./send";
import User from "./User";

@Entity('account')
export default class Account {
  @PrimaryColumn({ name: 'account_num' })
  accountNum!: string;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'password' })
  password!: string;

  @RelationId((account: Account) => account.user)
  userId!: string;

  @JoinColumn({ name: 'fk_user_id' })
  @ManyToOne(type => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @Column({ name: 'pay' })
  pay!: number;

  @ManyToMany(type => Send, send => send.account)
  send!: Send[];

  @ManyToMany(type => Receive, receive => receive.account)
  receive!: Receive[];
}