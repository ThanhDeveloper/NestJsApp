import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { AutoMap } from '@automapper/classes';

@Table({ timestamps: false })
export class User extends Model<User> {
  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @AutoMap()
  @IsNotEmpty()
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  })
  username: string;

  @IsNotEmpty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
}
