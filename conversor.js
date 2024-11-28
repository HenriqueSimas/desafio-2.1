import axios from 'axios';

export class ConversorMoeda {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}`;
  }

  async converter(moedaOrigem, moedaDestino, valor) {
    const url = `${this.baseUrl}/latest/${moedaOrigem}`;
    try {
      const response = await axios.get(url);

      if (response.data.result !== 'success') {
        throw new Error(`Erro da API: ${response.data['error-type'] || 'Desconhecido'}`);
      }

      const taxas = response.data.conversion_rates;
      const taxa = taxas[moedaDestino];

      if (!taxa) {
        throw new Error(`Moeda de destino (${moedaDestino}) não suportada.`);
      }

      const valorConvertido = (valor * taxa).toFixed(2); // Arredonda para 2 casas decimais
      const valorFormatado = parseFloat(valorConvertido).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      const taxaFormatada = taxa.toLocaleString('pt-BR', { minimumFractionDigits: 6, maximumFractionDigits: 6 });
      return {
        valorConvertido: valorFormatado,
        taxa: taxaFormatada,
      };
    } catch (error) {
      if (error.response) {
        throw new Error(
          `Erro na comunicação com a API: HTTP ${error.response.status} - ${error.response.data['error-type'] || 'Erro desconhecido'}`
        );
      } else {
        throw new Error('Erro na comunicação com a API: ' + error.message);
      }
    }
  }

  validarMoeda(moeda) {
    if (!moeda || moeda.length !== 3) {
      throw new Error('A moeda deve ter exatamente 3 caracteres (ex.: USD, EUR).');
    }
  }

  validarValor(valor) {
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      throw new Error('O valor deve ser um número maior que 0.');
    }
    return valorNumerico;
  }
}
