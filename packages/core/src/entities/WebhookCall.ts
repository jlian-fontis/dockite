import GraphQLJSON from 'graphql-type-json';
import { Field as GraphQLField, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Webhook } from './Webhook';

@Entity()
@ObjectType()
export class WebhookCall {
  @PrimaryGeneratedColumn('uuid')
  @GraphQLField()
  public id!: string;

  @Column()
  @GraphQLField()
  public success!: boolean;

  @Column()
  @GraphQLField()
  public status!: number;

  @Column('jsonb', { default: {}, nullable: true })
  @GraphQLField(_type => GraphQLJSON)
  public request!: any; // eslint-disable-line

  @Column('jsonb', { nullable: true })
  @GraphQLField(_type => GraphQLJSON)
  public response!: any; // eslint-disable-line

  @Column()
  @GraphQLField(_type => Date)
  public executedAt!: Date;

  @Column({ nullable: true })
  public webhookId!: string;

  @ManyToOne(
    _type => Webhook,
    webhook => webhook.calls,
    {
      onDelete: 'SET NULL',
    },
  )
  public webhook!: Webhook;
}
