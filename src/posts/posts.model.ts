import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface PostAttrs {
  id: number;
  title: string;
  image: string;
  ticket: number;
  days: number;
  price: number;
  sold: number;
  yeld: string;
}

@Table({ tableName: 'posts' })
export class Post extends Model<PostAttrs> {
  @ApiProperty({ example: '12345', description: 'Unique identificator' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'image_1', description: 'name' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgA',
    description: 'blob',
  })
  @Column({ type: DataType.STRING })
  image: string;

  @ApiProperty({ example: 'ticket', description: 'ticket' })
  @Column({ type: DataType.NUMBER, allowNull: false })
  ticket: number;

  @ApiProperty({ example: 'days', description: 'days' })
  @Column({ type: DataType.NUMBER, allowNull: false })
  days: number;

  @ApiProperty({ example: 'price', description: 'price' })
  @Column({ type: DataType.NUMBER, allowNull: false })
  price: number;

  @ApiProperty({ example: 'sold', description: 'sold' })
  @Column({ type: DataType.NUMBER, allowNull: false })
  sold: number;

  @ApiProperty({ example: 'yeld', description: 'yeld' })
  @Column({ type: DataType.STRING, allowNull: false })
  yeld: string;
}
