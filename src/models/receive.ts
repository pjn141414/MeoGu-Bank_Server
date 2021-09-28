import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import Account from "./account";

@Entity('receive')
export default class Receive {
  @PrimaryGeneratedColumn({ name: 'idx' })
  idx!: number;

  @Column({ name: 'sender_id' })
  senderId!: string;

  @RelationId((account: Account) => account.accountNum)
  accountNum!: string;

  @JoinColumn({ name: 'fk_account_num' })
  @ManyToMany(type => Account, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account!: Account;

  @Column({ name: 'pay' })
  pay!: number;

  @CreateDateColumn({ name: 'create_at' })
  createAt!: Date;
}