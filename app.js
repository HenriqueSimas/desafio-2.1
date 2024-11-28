// main.js
import { ConversorMoeda } from './conversor.js'; // Importando a classe do módulo
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_KEY = '0068094cebe5e2567463048a';
const conversor = new ConversorMoeda(API_KEY);

function perguntar() {
  rl.question('Digite a moeda de origem (ou pressione ENTER para sair): ', (moedaOrigem) => {
    if (!moedaOrigem) {
      console.log('Programa encerrado.');
      rl.close();
      return;
    }

    rl.question('Digite a moeda de destino: ', (moedaDestino) => {
      if (moedaOrigem === moedaDestino) {
        console.log('A moeda de origem não pode ser igual à moeda de destino.');
        perguntar();
        return;
      }

      try {
        conversor.validarMoeda(moedaOrigem.toUpperCase());
        conversor.validarMoeda(moedaDestino.toUpperCase());

        rl.question('Digite o valor a ser convertido: ', (valor) => {
          try {
            // Substitua a vírgula por um ponto para garantir que o valor seja reconhecido corretamente
            const valorFormatado = valor.replace(',', '.');
            const valorNumerico = conversor.validarValor(valorFormatado);
            conversor.converter(moedaOrigem.toUpperCase(), moedaDestino.toUpperCase(), valorNumerico)
              .then(resultado => {
                // Mostra o resultado em forma de tabela
                console.table([{
                  'Moeda de Origem': moedaOrigem.toUpperCase(),
                  'Moeda de Destino': moedaDestino.toUpperCase(),
                  'Valor Original': `${valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ${moedaOrigem.toUpperCase()}`,
                  'Valor Convertido': `${resultado.valorConvertido} ${moedaDestino.toUpperCase()}`,
                  'Taxa de Conversão': resultado.taxa
                }]);
                console.log(); // Adiciona uma linha em branco
                perguntar(); // Pergunta novamente
              })
              .catch(error => {
                console.log(error.message);
                console.log(); // Adiciona uma linha em branco
                perguntar();
              });
          } catch (error) {
            console.log(error.message);
            console.log(); // Adiciona uma linha em branco
            perguntar();
          }
        });
      } catch (error) {
        console.log(error.message);
        console.log(); // Adiciona uma linha em branco
        perguntar();
      }
    });
  });
}

perguntar();