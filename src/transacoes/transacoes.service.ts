import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
import { Transacao, TransacaoDocument } from './schemas/transacao.schema';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<TransacaoDocument>,
  ) {}

  async criar(dados: CriarTransacaoDto) {
    const transacao = new this.transacaoModel(dados);
    return transacao.save();
  }

  async listarComMetricas() {
    const historico = await this.transacaoModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    let saldoTotal = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const transacao of historico) {
      const valor = Number(transacao.valor);

      if (transacao.tipo === 'receita') {
        saldoTotal += valor;
      }

      if (transacao.tipo === 'despesa') {
        saldoTotal -= valor;
        totalDespesas += valor;

        if (transacao.consumoConsciente === false) {
          totalGastoImpulso += valor;
        }
      }
    }

    return {
      historico,
      metricas: {
        saldoTotal: this.arredondar(saldoTotal),
        totalDespesas: this.arredondar(totalDespesas),
        totalGastoImpulso: this.arredondar(totalGastoImpulso),
      },
    };
  }

  private arredondar(valor: number) {
    return Number(valor.toFixed(2));
  }
}
