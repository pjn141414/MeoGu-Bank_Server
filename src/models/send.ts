import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import Account from "./account";

@Entity('send')
export default class Send {
  @PrimaryGeneratedColumn({ name: 'idx' })
  idx!: number;

  @Column({ name: 'receiver_id' })
  receiverId!: string;

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