import jsonschema from 'jsonschema';
import { input, output } from './schemas.js';
import { tiposDeConexao, classesDeConsumo, modalidadesTarifarias } from './tipos.js';


const calculateCO2EmissionReduction = (consumption) => {
  const averageConsumption = consumption.reduce((sum, value) => sum + value, 0);
  const annualCO2Emission = (averageConsumption * 84) / 1000; // 84kg de CO2 por 1000 kWh
  return annualCO2Emission;
};

export const checkEligibility = (data) => {
  const { tipoDeConexao, classeDeConsumo, modalidadeTarifaria, historicoDeConsumo } = data;

  // Critérios de elegibilidade
  const isEligibleClass = ['comercial', 'residencial', 'industrial'].includes(classeDeConsumo);
  const isEligibleTariff = ['convencional', 'branca'].includes(modalidadeTarifaria);

  const consumptionLimit = {
    monofasico: 400,
    bifasico: 500,
    trifasico: 750,
  }[tipoDeConexao];

  const isAboveConsumptionLimit = historicoDeConsumo.reduce((sum, value) => sum + value, 0) / historicoDeConsumo.length >= consumptionLimit;

  if (!isEligibleClass || !isEligibleTariff || !isAboveConsumptionLimit) {
    return {
      elegivel: false,
      razoesDeInelegibilidade: [
        !isEligibleClass && 'Classe de consumo não aceita',
        !isEligibleTariff && 'Modalidade tarifária não aceita',
        !isAboveConsumptionLimit && 'Consumo muito baixo para tipo de conexão',
      ].filter(Boolean),
    };
  }

 const economiaAnualDeCO2 = calculateCO2EmissionReduction(historicoDeConsumo);
  return {
    elegivel: true,
    economiaAnualDeCO2,
  };
};

export const validateInput = (data) => {
  const validator = new jsonschema.Validator();
  const validationResult = validator.validate(data, input);
  if (!validationResult.valid) {
    throw new Error(`Dados de entrada inválidos: ${validationResult.errors.map((error) => error.stack).join('\n')}`);
  }
};
