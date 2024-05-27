import { Exclude } from "class-transformer";
import { Post } from "../../post/entities/post.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Column()
  @Exclude()
  name: string;

  @Column()
  @Exclude()
  password: string;
}
