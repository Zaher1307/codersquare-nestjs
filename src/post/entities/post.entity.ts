import { User } from "../../user/entites/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column()
  userId: string;

  @Column()
  payload: string;

  @Column()
  createdAt: Date;
}
