import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import Account from "./account";

@Entity('send')
export default class Send {
  @PrimaryGeneratedColumn({ name: 'idx' })
  idx!: number;

  @Column({ name: 'sender_id' })
  senderId!: string;

  @Column({ name: 'receiver_id' })
  receiverId!: string;

  @RelationId((send: Send) => send.account)
  accountNum!: string;

  @JoinColumn({ name: 'fk_account_num' })
  @ManyToOne(type => Account, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account!: Account;

  @Column({ name: 'pay' })
  pay!: number;

  @CreateDateColumn({ name: 'create_at' })
  createAt!: Date;
}