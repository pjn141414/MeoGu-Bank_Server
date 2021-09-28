import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from "typeorm";
import Account from "./account";
import EasyPassword from "./easyPassword";

@Entity('user')
export default class User {
  @PrimaryColumn({ name: 'id' })
  id!: string;

  @Column({ name: 'password' })
  password!: string;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'nickname' })
  nickname!: string;

  @Column({
    name: 'phone',
    unique: true,
  })
  phone!: string;

  @Column({ name: 'birth' })
  birth!: string;

  @Column({
    name: 'profile_image',
    nullable: true,
  })
  profileImage!: string | null;

  @OneToOne(type => EasyPassword, easyPassword => easyPassword.user)
  easyPassword!: EasyPassword;

  @OneToMany(type => Account, account => account.user)
  account!: Account[];
}