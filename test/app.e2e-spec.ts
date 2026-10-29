import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TransacoesController } from '../src/transacoes/transacoes.controller';
import { TransacoesService } from '../src/transacoes/transacoes.service';

describe('TransacoesController (e2e)', () => {
  let app: INestApplication;

  const serviceMock = {
    criar: jest.fn(),
    listarComMetricas: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [
        {
          provide: TransacoesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transacoes (POST)', async () => {
    const transacao = {
      descricao: 'Conta de Luz',
      valor: 180,
      tipo: 'despesa',
      categoria: 'Moradia',
      consumoConsciente: true,
    };

    serviceMock.criar.mockResolvedValue(transacao);

    await request(app.getHttpServer())
      .post('/transacoes')
      .send(transacao)
      .expect(201)
      .expect(transacao);
  });

  it('/transacoes (GET)', async () => {
    const resposta = {
      historico: [],
      metricas: {
        saldoTotal: 0,
        totalDespesas: 0,
        totalGastoImpulso: 0,
      },
    };

    serviceMock.listarComMetricas.mockResolvedValue(resposta);

    await request(app.getHttpServer())
      .get('/transacoes')
      .expect(200)
      .expect(resposta);
  });
});
