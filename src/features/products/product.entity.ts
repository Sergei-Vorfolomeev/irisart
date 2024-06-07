import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductsCategory } from './types/products-type.enum'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ enum: ProductsCategory })
  category: ProductsCategory

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  price: number

  @Column({ nullable: true })
  image: string

  @Column({ default: false })
  isAvailable: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
