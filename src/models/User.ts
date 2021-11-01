import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({ description: '아이디' })
  @PrimaryColumn({ name: 'id' })
  id!: string;

  @ApiProperty({ description: '비밀번호' })
  @Column({ name: 'password' })
  password!: string;

  @ApiProperty({ description: '이름(실명)' })
  @Column({ name: 'name' })
  name!: string;

  @ApiProperty({ description: '닉네임(가명)' })
  @Column({ name: 'nickname' })
  nickname!: string;

  @ApiProperty({ description: '전화번호' })
  @Column({
    name: 'phone',
    unique: true,
  })
  phone!: string;

  @ApiProperty({ description: '생년월일' })
  @Column({ name: 'birth' })
  birth!: string;

  @ApiProperty({ description: '프로필 사진' })
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