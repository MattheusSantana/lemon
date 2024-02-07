import request from 'supertest';
import app from './index.js';

describe('POST /checkEligibility', () => {
  it('should return 200 and eligible', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'comercial',
        modalidadeTarifaria: 'convencional',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

      
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: true,
      economiaAnualDeCO2: 5553.24,
    });
  });

  it('should return 200 and eligible', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'residencial',
        modalidadeTarifaria: 'convencional',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: true,
      economiaAnualDeCO2: 5553.24,
    });
  });

  it('should return 200 and eligible', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'industrial',
        modalidadeTarifaria: 'convencional',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: true,
      economiaAnualDeCO2: 5553.24,
    });
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({});

    expect(response.status).toBe(400);
  });

  it('should return 400 and razoesDeInelegibilidade for invalid input with empty historicoDeConsumo', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'comercial',
        modalidadeTarifaria: 'convencional',
        historicoDeConsumo: [],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        "error": "Dados de entrada inválidos: instance.historicoDeConsumo does not meet minimum length of 3"
    });
  });

  it('should return 400 and razoesDeInelegibilidade for invalid input with empty historicoDeConsumo', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'comercial',
        modalidadeTarifaria: 'convencional',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597, 3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        "error": "Dados de entrada inválidos: instance.historicoDeConsumo does not meet maximum length of 12"
    });
  });

  it('should return 200 and razoesDeInelegibilidade for invalid input with classeDeConsumo not accepted', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'rural',
        modalidadeTarifaria: 'convencional',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: false,
      razoesDeInelegibilidade: [
        'Classe de consumo não aceita',
      ],
    });
  });

    it('should return 200 and razoesDeInelegibilidade for invalid input with classeDeConsumo not accepted', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'Poder Público',
        modalidadeTarifaria: 'convencional',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: false,
      razoesDeInelegibilidade: [
        'Classe de consumo não aceita',
      ],
    });
  });

  it('should return 200 and razoesDeInelegibilidade for invalid input with modalidadeTarifaria not accepted', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'comercial',
        modalidadeTarifaria: 'verde',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: false,
      razoesDeInelegibilidade: [
        'Modalidade tarifária não aceita',
      ],
    });
  });

  it('should return 200 and razoesDeInelegibilidade for invalid input with modalidadeTarifaria not accepted', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'comercial',
        modalidadeTarifaria: 'azul',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: false,
      razoesDeInelegibilidade: [
        'Modalidade tarifária não aceita',
      ],
    });
  });

  it('should return 200 and razoesDeInelegibilidade for invalid input with classeDeConsumo and modalidadeTarifaria not accepted', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'rural',
        modalidadeTarifaria: 'azul',
        historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: false,
      razoesDeInelegibilidade: [
        "Classe de consumo não aceita",
		"Modalidade tarifária não aceita"
      ],
    });
  });

  it('should return 200 and razoesDeInelegibilidade for invalid input with classeDeConsumo, modalidadeTarifaria not accepted and AboveComsumption', async () => {
    const response = await request(app)
      .post('/checkEligibility')
      .send({
        numeroDoDocumento: '14041737706',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'rural',
        modalidadeTarifaria: 'azul',
        historicoDeConsumo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      elegivel: false,
      razoesDeInelegibilidade: [
        "Classe de consumo não aceita",
		"Modalidade tarifária não aceita",
		"Consumo muito baixo para tipo de conexão"
      ],
    });
  });

});
