import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity()
export class Fidelidade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario: Usuario;

  @Column()
  saldo_pontos: number;

  @Column()
  pontos_resgatados: number;

  @Column()
  ultima_atividade: Date;
}
