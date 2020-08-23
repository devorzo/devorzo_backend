import { } from '@typegoose/typegoose';
import { InputType, Field } from 'type-graphql';
import { User, Gender } from '../entities/user';

@InputType()
export class CreateNewUserInput implements Partial<User> {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  username!: string;

  @Field()
  fullname!: string;

  @Field({ nullable: true })
  userBio!: string;

  @Field({ nullable: true })
  gender!: Gender;
}

@InputType()
export class CheckUserIfUniqueInput implements Partial<User> {
  @Field({ nullable: true })
  email!: string;

  @Field({ nullable: true })
  username!: string;
}

@InputType()
export class FindUserInput implements Partial<User> {
  @Field({ nullable: true })
  email!: string;

  @Field({ nullable: true })
  username!: string;

  @Field({ nullable: true })
  userId!: string;
}

@InputType()
export class FollowUserInput implements Partial<User> {
  @Field({ nullable: true })
  email!: string;

  @Field({ nullable: true })
  username!: string;

  @Field()
  userId!: string;
}

@InputType()
export class LogUserInput implements Partial<User> {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType({})
export class SocialLinksInput {
  @Field({ nullable: true })
  github!: string;

  @Field({ nullable: true })
  twitter!: string;

  @Field({ nullable: true })
  linkedin!: string;

  @Field({ nullable: true })
  link!: string;
}

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  email!: string;

  @Field({ nullable: true })
  username!: string;

  @Field({ nullable: true })
  fullname!: string;

  @Field({ nullable: true })
  profileImage!: string;

  @Field({ nullable: true })
  userBio!: string;

  @Field({ nullable: true })
  gender!: Gender;

  @Field(() => SocialLinksInput, { nullable: true })
  socialLinks!: SocialLinksInput
}
