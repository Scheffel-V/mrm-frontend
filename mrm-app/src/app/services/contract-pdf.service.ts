import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { ItemRental } from '../models/item-rental.model';
import { Rental } from '../models/rental.model';
import { CustomerService } from './customer.service';
import { RentalService } from './rental.service';


const LOGO_IMAGE = 'data:image/png;base64,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L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5DT01QUkVTU09SRVM8L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+VmluaWNpdXMgU2NoZWZmZWw8L3BkZjpBdXRob3I+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnhtcD0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyc+CiAgPHhtcDpDcmVhdG9yVG9vbD5DYW52YTwveG1wOkNyZWF0b3JUb29sPgogPC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9J3InPz6KhwNSAAAAAElFTkSuQmCC';

const SECTION_1 = `A Locadora aluga os bens móveis, abaixo descritos de sua propriedade para uso exclusivo no endereço aqui especificado:`
const CLAUSES = [
  { id: "\n\n1) DO LOCAL DE UTILIZAÇÃO DO BEM LOCADO", content: "" },
  { id: "1.1", content: "Além do bem acima descrito, compõem também o objeto contratual os acessórios citados acima." },
  { id: "1.2", content: "O local de utilização do bem é exclusivamente no endereço citado no campo \"local de entrega\"." },
  { id: "1.3", content: "O local de utilização do bem locado é exclusivamente o descrito no item 1.2." },
  { id: "1.4", content: "Sendo o bem instalado ou utilizado em local diverso ao previsto na cláusula a LOCATÁRIA assume a responsabilidade por qualquer intercorrência, bem como, permanecerá integralmente responsável por todas as cláusulas e condições deste contrato." },
  { id: "\n\n2) DAS CONDIÇÕES PRÉVIAS DO OBJETO CONTRATUAL E DO FRETE", content: "" },
  { id: "2.1", content: "Após a realização de vistoria e inspeção prévia dos equipamentos locados, incluindo os acessórios, a LOCATÁRIA declara ter recebido os bens ora locados em perfeitas condições para o trabalho, aportando o aceite do termo de recebimento e funcionamento dos equipamentos, comprometendo-se a devolver os bens locados nas mesmas condições em que as recebeu." },
  { id: "2.2", content: "O frete do equipamento locado será previamente combinado no envio do orçamento. É de responsabilidade da LOCATÁRIA o pagamento do valor de transporte de ida até as dependências da LOCATÁRIA e de retorno a sede da LOCADORA. Podendo a LOCADORA cobrá-lo embutido na locação, também pode a LOCATÁRIA agendar com transporte terceirizado ou realizar a coleta na sede de LOCADORA, cabendo tomar a decisão juntas, entretanto prevalecendo a decisão da LOCADORA." },
  { id: "2.3", content: "Quando a LOCADORA for responsável pelo frete de devolução (retorno) do equipamento locado, a LOCATÁRIA terá a obrigação de avisar formalmente , no prazo de 48 horas do término de locação, que o contrato irá se encerrar e que declina de interesse de renovação. Caso a LOCADORA não seja informada, poderá ser cobrado o valor de uma diária proporcional." },
  { id: "2.4", content: "A descarga do equipamento, havendo necessidade de Munck ou empilhadeira, é responsabilidade da locatária." },
  { id: "\n\n3) DA INSTALAÇÃO", content: "" },
  { id: "3.1", content: "A instalação dos equipamentos pode ou não ser feita pelo técnicos da GMA, sendo eles capacitados e disporem das respectivas NRs, a instalação não terá nenhum custo para a LOCATÁRIA desde que o equipamento se encontre até 100km das dependências da locatária, ou mediante prévio combinado. Sendo a instalação feita pela LOCATÁRIA, a mesma se compromete em seguir todas as instruções da GMA, dispor de pessoal capacitado, e seguir as normas de segurança, desligando o disjuntor para fazê-lo e utilizando cabos de boa qualidade." },
  { id: "3.2", content: "Grupo Gerador de Energia: a LOCATÁRIA é responsável por deixar pronto disjuntores e rede interna da empresa do cliente, onde os técnicos da LOCADORA farão a ligação dos cabos na rede elétrica do cliente. A LOCADORA não fará troca de disjuntores ou de cabos da rede interna da locatária, devendo ser chamado eletricista próprio ou terceirizado. O abastecimento do Gerador de energia deve ser previamente combinado e formalizado no Orçamento e nas observações deste contrato, entretanto fica estabelecido que sendo por conta do cliente, o mesmo deve abastecê-lo com Diesel S10." },
  { id: "3.3", content: "Compressores de ar elétricos, secadores de ar, schiller de refrigeração: : a LOCATÁRIA é responsável por deixar pronto disjuntores e rede interna da empresa do cliente, onde os técnicos da LOCADORA farão a ligação dos cabos na rede elétrica do cliente. A LOCADORA não fará troca de disjuntores ou de cabos da rede interna da locatária, devendo ser chamado eletricista próprio ou terceirizado. Também deve deixar pronta a rede de ar ou qualquer que deva ser conectada a máquina locada. Não sendo parte do contrato de locação qualquer tipo de instalação industrial como colocação de tubulações ou cabos." },
  { id: "3.4", content: "Para a instalação, a LOCADORA disponibiliza 5 metros de cabo para ligação da máquina, havendo necessidade de maior quantidade, deve ser informado a LOCADORA no ato de confirmação da locação, e um valor a mais será cobrado quando for quantidade acima de 5 metros." },
  { id: "3.5", content: "Em caso de locação dos equipamentos para uso em obras e construções, a máquina, especialmente compressores elétricos deverão ser instalados a uma distância que não gere a absorção da sujeira advinda da obra, o que pode gerar a obstrução do radiador, dano ao filtro separador e de óleo." },
  { id: "3.6", content: "Os equipamentos elétricos devem sempre ser instalados em local coberto por telhado e paredes, em sala espaçosa com boa ventilação, a falta de local adequado caracteriza mau uso, pois eleva excessivamente a temperatura do equipamento, causando  seu desarme." },
  { id: "3.7", content: "Em caso de uso dos equipamentos elétricos em local mau coberto, deve ser solicitado a LOCATÁRIA skid para proteção do mesmo. Se solicitada por parte da LOCATÁRIA  a instalação para os técnicos da gma, será sem custo de deslocamento desde que a locatária esteja até 100km/h da sede da gma. Caso contrário, o deslocamento fica fixado no valor de R$ 2,20 por quilometro rodado (valor pode ser negociado)." },
  { id: "\n\n4) DO PRAZO CONTRATUAL", content: "" },
  { id: "4.1", content: "O presente contrato tem prazo determinado, conforme citado na Clausula 1 (data de inicio e data de término)." },
  { id: "4.2", content: "O primeiro período de locação que for contratado deve ser cumprido em sua totalidade, mesmo que a máquina seja devolvida antes do final do período, não haverá reembolso e sequer cobrança proporcional da locação." },
  { id: "4.3", content: "No término do prazo acima estipulado, acaso haja interesse das partes em renovar o contato, a parte que demonstrar interesse na renovação deverá comunicar a outra parte por escrito, com antecedência mínima de 3 (três) dias antes do término do contrato, especificando o prazo total de duração da referida renovação contratual pretendida." },
  { id: "4.4", content: "O contrato será renovado automaticamente, pelo mesmo período, se o Locatário não efetuar a devolução da máquina alugada ao Locador, impreterivelmente até o dia do vencimento do contrato." },
  { id: "4.5", content: "Entretanto, não havendo interesse na renovação, haverá a rescisão do contrato, bastando para isso a comunicação da LOCATÁRIA do dia e horário em que a LOCADORA receberá em sua sede a restituição dos bens locados, com a realização de vistoria no ato da entrega do bem." },
  { id: "4.6", content: "Se o prazo for igual a 30 dias, se renovará pelo mesmo período. Sendo inferior a 30 dias, se renovará por igual período." },
  { id: "4.7", content: "Após o cumprimento total do primeiro período de locação contratado, na renovação, poderá não ser cumprido totalmente, neste caso será calculado e cobrado o valor proporcional aos dias usados (calculo: período locado dividido pelo valor da locação, multiplicado pelos dias usados)." },
  { id: "4.8", content: "Quando a LOCADORA for responsável pelo frete de devolução (retorno) do equipamento locado, a LOCATÁRIA terá a obrigação de avisar formalmente , no prazo de 48 horas do término de locação, que o contrato irá se encerrar e que declina de interesse de renovação. Caso a LOCADORA não seja informada, poderá ser cobrado o valor de uma diária proporcional." },
  { id: "4.9", content: "Havendo interesse, pode-se realizar contrato para período longos (considera-se a longos a partir de 06 meses), nesse caso, a LOCADORA poderá negociar valor promocional a seu critério, entretanto, após tratado e formalizado interesse por email ou whatsapp, o período deverá ser cumprido, podendo acarretar em multa contratual de 20% (vinte por cento) da soma total do contrato (valor mensal multiplicado pelo período contratado)." },
  { id: "\n\n5) DO VALOR", content: "" },
  { id: "5.1", content: "O valor do aluguel mensal, quinzenal ou diárias, citado no campo 1.0, deverá ser pago diretamente para a empresa LOCADORA, até o dia e mês citado no campo 1.0;" },
  { id: "5.2", content: "O pagamento pode se dar mediante BOLETO, DEPÓSITO OU CARTÃO DE CRÉDITO (neste último caso, com taxas da máquina de cartão a acrescer), que será negociado entre LOCATÁRIO E LOCADOR." },
  { id: "5.3", content: "Havendo o envio de boleto para a LOCATÁRIA, não poderá ocorrer o pagamento de outra forma, mesmo que esteja vencido, se for pago em atraso, os juros deverão ser arcados pela LOCATÁRIA." },
  { id: "5.4", content: "Caso a LOCATÁRIA mesmo assim deposite o valor da locação, descumprindo o combinado, será cobrada na próxima fatura os juros e taxas advindos da baixa e atraso do boleto. Que pode variar de acordo com os dias em atraso." },
  { id: "5.5", content: "Os boletos vencidos serão enviados para cobrança em cartório, ocorrendo assim, o cliente deverá aguardar o boleto do respectivo cartório da sua cidade. 5.6 Após isso, mesmo em caso de depósito por parte da LOCATÁRIA do valor a conta da LOCADORA, mediante o envio do comprovante de depósito, e estiver dentro de prazo estipulado por cartório, a LOCADORA poderá pedir a susta do protesto, entretanto, a taxa cobrada pelo cartório será repassada a LOCATÁRIA, no período de locação seguinte, ou caso não haja renovação deverá ser pago a LOCADORA mediante boleto ou depósito." },
  { id: "5.6", content: "Acaso ocorra a hipótese prevista nas cláusulas 4.3 e 4.4, o valor do aluguel será reajustado anualmente pelo IGP-M, acrescido de 10 pontos percentuais." },
  { id: "\n\n6) DA MORA", content: "" },
  { id: "6.1", content: "Em caso de atraso no pagamento do aluguel, o valor em aberto será corrigido pelo IGP-M e, sobre ele, incidirá juros de 1% ao mês, desde o vencimento do valor devido até a data do efetivo pagamento." },
  { id: "6.2", content: "Além da correção monetária e da incidência de juros, sobre o valor vencido incidirá multa compensatória de 10% (dez por cento) do valor total em atraso." },
  { id: "\n\n7) DA CESSÃO OU SUBLOCAÇÃO", content: "" },
  { id: "7.1", content: "A cessão ou transferência da presente locação, ou sublocação, no todo ou em parte do objeto deste contrato, somente poderá ocorrer mediante autorização escrita da LOCADORA, sob pena de plena rescisão do presente contrato. Devendo o pedido ser formalizado por e-mail. A sublocação não é permitida." },
  { id: "7.2", content: "Em caso de locação para uso em obras, o LOCATÁRIO deve sempre informar a LOCADORA do local onde o equipamento irá trabalhar, formalizando a alteração por e-mail ou Whatsapp." },
  { id: "7.3", content: "Ocorrendo a hipótese prevista na cláusula 7.1, a LOCATÁRIA arcará com multa contratual de 20% (vinte por cento) do valor total do contrato, ficando inteiramente responsável pelos bens locados, inclusive por sua conservação." },
  { id: "\n\n8) DAS OBRIGAÇÕES DA LOCADORA", content: "" },
  { id: "8.1", content: "A LOCADORA é responsável por indenizar a LOCATÁRIA na ordem inversa deste, se os equipamentos objeto deste contrato não atenderem a finalidade a que foram locados, no caso de falhas irreversíveis e de que dependa a substituição dos equipamentos." },
  { id: "8.2", content: "Durante o período em que os bens permanecerem locados para a LOCATÁRIA, e sendo necessário qualquer assistência técnica, ou manutenção corretiva advindas de desgaste natural de peças, essa será prestada exclusivamente pela LOCADORA, ou sob sua supervisão, sob pena de rescisão contratual." },
  { id: "8.3", content: "Instruir e estar à disposição do cliente para eventuais dúvidas referente ao uso do equipamento." },
  { id: "8.4", content: "Dispor de máquina reserva igual ou similar em estoque, em caso de problemas sérios com a máquina locada, salvo o frete que deverá ser por conta da LOCATÁRIA. Havendo necessidade de envio de máquina de maior potência, o valor de locação será reajustado conforme a tabela de locação vigente." },
  { id: "8.5", content: "As manutenções preventivas das máquinas são por conta e responsabilidade da LOCADORA, e os intervalos podem variar de acordo com o regime de uso diário da máquina por parte do cliente ou pelo nível de sujeira dentro das dependências do mesmo." },
  { id: "8.6", content: "Fazer a limpeza do equipamento evitando o super aquecimento da máquina, com periodicidades variando conforme a sujeira do local instalado, devendo a LOCATÁRIA fazer chamado de técnico. Havendo chamado por parada na máquina locada, a LOCADORA tem até 72 horas para atender a LOCATÁRIA sem gerar nenhum tipo de ônus para as partes." },
  { id: "\n\n9) DAS OBRIGAÇÕES DA LOCATÁRIA", content: "" },
  { id: "9.1", content: "Em caso de ocorrência de danos externos aos bens locados, a manutenções advindas desses casos serão cobradas exclusivamente da LOCATÁRIA. Ou caso o dano seja irreversível, deverá ser ressarcido pela LOCATÁRIA." },
  { id: "9.2", content: "Casos que o conserto do equipamento será cobrado da locatária:" },
  { id: "-", content: "Queima de motor causado por quedas de tensão;"},
  { id: "-", content: "Trava da unidade compressora causado por ligação do equipamento em fase invertida;"},
  { id: "-", content: "Dano na válvula de admissão causado por estrangulamento da saída de ar;"},
  { id: "-", content: "Uso por parte da locatária de cabos danificados ou mal colocados ou sem aterramento quando é necessário que seja feito;"},
  { id: "-", content: "Roubo ou furto da máquina ou de partes e peças dela;"},
  { id: "-", content: "Incêndio ou avarias"},
  { id: "-", content: "Amassados na lataria da máquina causados por falta de cuidado no transporte ou descarregamento da máquina; Ou entrada de material corrosivo como tinta ou cimento, corroendo a lataria da máquina."},
  { id: "-", content: "Instalação da máquina em local insalubre, como próximo de cimento, tinta, ou qualquer material que, absorvido pela máquina ocasione estragos ao equipamento. Pois a absorção desse material corrosivo para dentro da rede da máquina e danificando partes como o radiador, filtro separador, filtro de ar;"},
  { id: "9.3", content: "As movimentações de máquinas dentro da empresa LOCATÁRIA também devem ser informadas a LOCADORA." },
  { id: "9.4", content: "Em caso de ocorrência de falha ou dificuldade de funcionamento adequado no equipamento locado, a LOCATÁRIA deverá comunicar imediatamente e inclusive por escrito a LOCADORA, para que possa solucionar de plano tais ocorrências. Não podendo a LOCATÁRIA realizar a substituição de peças da máquina sem autorização por escrito da LOCADORA, entre eles: troca de filtro de ar, filtro de óleo, filtro separador, contactores, e especialmente óleo quando for um diferente do óleo usado pela LOCADORA, sem a autorização da LOCADORA." },
  { id: "9.5", content: "Em caso de a LOCATÁRIA observar mau funcionamento no equipamento locado e não comunicar a LOCADORA imediatamente, e o equipamento tiver seu funcionamento ainda mais prejudicado por esse motivo, a LOCATÁRIA arcará com os custos necessários para os devidos consertos." },
  { id: "9.6", content: "Responsabilidade da LOCATÁRIA monitorar o funcionamento do equipamento enquanto locado, realizando testes e rotinas, afim de garantir o perfeito desempenho do equipamento." },
  { id: "9.7", content: "A LOCADORA deverá ser acionada imediatamente após o equipamento apresentar algum mau funcionamento, podendo inicialmente prestar atendimento técnico por telefone, afim de agilizar o retorno da atividade do equipamento. Todavia, se o técnico achar necessário, o mais breve possível, deve ir realizar visita técnica." },
  { id: "\n\n10) DA DEVOLUÇÃO DO BEM LOCADO", content: "" },
  { id: "10.1", content: "Na entrega dos bens locados, as partes farão uma vistoria relatando o estado em que se encontram os bens. Estando nas mesmas condições em que foram locados, e sendo quitados todos os aluguéis e encargos, o presente contrato se dá por rescindido." },
  { id: "10.2", content: "Todos os itens locados e acessórios para instalação do equipamento deverão ser devolvidos junto do equipamento, sendo mencionados na nota fiscal de retorno dos equipamentos." },
  { id: "\n\n11) DA RESCISÃO CONTRATUAL", content: "" },
  { id: "11.1", content: "A LOCADORA poderá dar como rescindido o presente contrato, de plano direto, independentemente de qualquer interpelação judicial ou extrajudicial nos seguintes casos: a) se o locatário não pagar pontualmente qualquer das prestações mensais do aluguel ou faltar ao exato cumprimento de qualquer das obrigações assumidas no presente contrato; b) se o locatário usar a máquina, objeto deste contrato, para fins diversos daqueles para que foi locado; c) ou se a LOCATÁRIA locar ou ceder à terceiros os objetos locados." },
  { id: "11.2", content: "Na ocorrência de quaisquer das hipóteses previstas na cláusula 11.1, não assistirá ao locatário qualquer direito à indenização ou reclamação." },
  { id: "\n\n12) DAS DISPOSIÇÕES FINAIS", content: "" },
  { id: "12.1", content: "Por se tratar de locação de bens móveis sem necessidade de operador, dispensada de emissão de nota fiscal de serviço por não configurar atividade de prestação de serviço." },
];

const DISCLAMER = "LOCAÇÃO DE BENS MÓVEIS, DISPENSADA DE EMISSÃO DE NOTA FISCAL DE SERVIÇO POR NÃO CONFIGURAR ATIVIDADE DE PRESTAÇÃO DE SERVIÇO."

const CITY = "CAMPO BOM - RS";
const SIGN_FIELD = "ASSINATURA LOCATÁRIA: "

@Injectable({
  providedIn: 'root'
})
export class ContractPDFService {

  pdfMake: any;
  dateFormatter: any;
  formatter: any;
  totalItemsAmount: number;
  customer: Customer;
  rental: Rental;
  items: any;

  constructor(
    private customerService: CustomerService,
    private rentalService: RentalService
  ) {
    this.dateFormatter = new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    this.formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    this.totalItemsAmount = 0.0;
    this.customer = null;
    this.rental = null;
    this.items = [];
  }

  public getActualItemRentals(itemRentals : ItemRental[]) {
    let actualItemRentals = itemRentals.filter(itemRental => 
      itemRental.returnedAt === null
    )
    return actualItemRentals
  }

  async generateContract(rentalId: number) {
    this.totalItemsAmount = 0.0;
    this.customer = null;
    this.rental = null;
    this.items = [];
    await this.lazyLoadPDFLibraries();
   
    try {
      this.fetchRental(rentalId, this.generatePdf.bind(this));
    } catch (e) {
      console.log("Some error happened while fetching the rental data");
    }
  }


  fetchRental(id: number, callback: (arg0: Rental) => void): void {
    this.rentalService.getRental(id).subscribe(
      data => {
        this.rental = data
        this.rental.startDate = new Date(this.rental.startDate)
        this.rental.endDate = new Date(this.rental.endDate)
        this.rental.approvalDate = this.rental.approvalDate == null ? null : new Date(this.rental.approvalDate)
        this.rental.paymentDueDate = this.rental.paymentDueDate == null ? null : new Date(this.rental.paymentDueDate)

        this.items = this.rental.itemRentals;

        console.log(this.items);
        callback(data);

        console.log(data);

      }
    )
  }

  async generatePdf(rental) {
    await this.getCustomer(rental.customerId);
    const contractDefinition = this.generatePDFTemplate(rental);
    this.pdfMake.createPdf(contractDefinition).open();
  }

  async getCustomer(customerId: number) {
    console.log("Customer id", customerId);
    this.customer = await this.customerService.getCustomer(customerId).toPromise();
  }

  async lazyLoadPDFLibraries() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  addItemValue(value: number) {
    this.totalItemsAmount += value;
  }

  renderDeliveryCost(rental) {
    if (!rental.deliveryCost) {
      rental.deliveryCost = 0.0;
    }
    return [
      {
        text: 'Frete',
        border: [false, false, false, true],
        alignment: 'right',
        fontSize: 10,
        margin: [0, 5, 0, 5],
      },
      {
        text: this.formatter.format(rental.deliveryCost),
        border: [false, false, false, true],
        fillColor: '#f5f5f5',
        alignment: 'right',
        fontSize: 10,
        margin: [0, 5, 0, 5],
      },
    ];
  }

  renderLaborAndDisplacementPrice(rental) {
    if (!rental.laborAndDisplacementPrice) {
      rental.laborAndDisplacementPrice = 0.0;
    }
    return [
      {
        text: 'Mão de Obra e Deslocamento',
        border: [false, false, false, true],
        alignment: 'right',
        fontSize: 10,
        margin: [0, 5, 0, 5],
      },
      {
        text: this.formatter.format(rental.laborAndDisplacementPrice),
        border: [false, false, false, true],
        fillColor: '#f5f5f5',
        alignment: 'right',
        fontSize: 10,
        margin: [0, 5, 0, 5],
      },
    ];
  }

  renderClauses() {
    return CLAUSES.map(clause => {
      return {
        text: [
          {text: `${clause.id} `, bold: true},
          clause.content,
        ],
        fontSize: 9,
      }
    })
  }

  renderContractStart() {
    const CONTRACT_START = `
      Pelo presente instrumento de locação de bens moveis que entre si, fazem como LOCADORA: GMA - COMERCIO DE MAQUINAS LTDA , EST RURAL II, 1506, QUATRO COLONIAS, 93700-000, CAMPO BOM - RS, Telefone: (51) 996720036 (51) 3064-0045, CPF/CNPJ: 10.457.619/0001-83, IE: 019/0131772, neste ato representada por seu representante legal infra-assinado e que doravante será designado LOCADORA e de outro lado: ${this.customer.name}, situada na ${this.customer.address.street}, ${this.customer.address.number}, ${this.customer.address.neighborhood}, ${this.customer.address.city}, CEP: ${this.customer.address.cep}, Telefone: ${this.customer.mobilePhone} / , inscrita no CNPJ: ${this.customer.cnpj}, doravante denominada LOCATÁRIA, Contrataram a locação dos bens móveis abaixo descritos, com respectivos valores unitários, mediante as condições estabelecidas nas cláusulas seguintes:\n
    `
    return CONTRACT_START;
  }

  generatePDFTemplate(rental) {
    let itemsRows = [];
    this.getActualItemRentals(rental.itemRentals).map(item => {
      itemsRows.push(this.getContractFromStockItem(item));
      this.addItemValue(item.value);
    });


    return {
      content: [
        {
          columns: [
            {
              image: LOGO_IMAGE,
              width: 150,
            },
            [
              {
                text: `Contrato - ${rental.contractNumber}`,
                color: '#333333',
                width: '*',
                fontSize: 15,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 15],
              },
            ],
          ],
        },
        {
          text: 'Contrato de Locação de Bens Móveis',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
        },
        {
          text: this.renderContractStart(),
          fontSize: 9,
        },
        {
          width: '100%',
          alignment: 'center',
          text: 'CLÁUSULAS DO CONTRATO DE LOCAÇÃO:',
          bold: true,
          margin: [0, 0, 0, 0],
          fontSize: 18,
        },
        {
          text: [
            {text: `\n1.0 `, bold: true},
            "\n\n"
          ],
          fontSize: 12
        },
        {
          width: '100%',
          alignment: 'center',
          text: 'Itens do contrato',
          bold: true,
          margin: [0, 0, 0, 0],
          fontSize: 15,
        },
        {
          table: {
            headerRows: 1,
            widths: ['25%', "*"],
            body: [
              [
                {
                  text: '1.1 OBJETO DO CONTRATO:',
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: SECTION_1,
                  border: [false, false, false, false],
                  alignment: 'left',
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                },
              ],
            ],
          }
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            hLineColor: function (i, node) {
              if (i === 1 || i === 0) {
                return '#CDC9C9';
              }
              return '#eaeaea';
            },
            vLineColor: function (i, node) {
              return '#eaeaea';
            },
            hLineStyle: function (i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i, node) {
              return 10;
            },
            paddingRight: function (i, node) {
              return 10;
            },
            paddingTop: function (i, node) {
              return 2;
            },
            paddingBottom: function (i, node) {
              return 2;
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['25%', '50%', '25%'],
            body: [
              [
                {
                  text: 'Código',
                  fillColor: '#A0E7E5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'Nome do item',
                  fillColor: '#A0E7E5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'Valor do item',
                  border: [false, true, false, true],
                  alignment: 'right',
                  fillColor: '#A0E7E5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
              ],
              //expand the items array
              ...itemsRows
            ],
          },
        },
        '\n',
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            hLineColor: function (i, node) {
              return '#eaeaea';
            },
            vLineColor: function (i, node) {
              return '#eaeaea';
            },
            hLineStyle: function (i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i, node) {
              return 10;
            },
            paddingRight: function (i, node) {
              return 10;
            },
            paddingTop: function (i, node) {
              return 3;
            },
            paddingBottom: function (i, node) {
              return 3;
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 0,
            widths: ['*', '30%'],
            body: [
              [
                {
                  text: 'Soma Total dos Itens',
                  fontSize: 10,
                  border: [false, true, false, true],
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, true, false, true],
                  text: this.formatter.format(this.totalItemsAmount),
                  fontSize: 10,
                  alignment: 'right',
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                }
              ],
              this.renderDeliveryCost(rental),
              this.renderLaborAndDisplacementPrice(rental),
              [
                {
                  text: 'Valor Total',
                  bold: true,
                  fontSize: 12,
                  alignment: 'right',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: this.formatter.format(rental.value),
                  bold: true,
                  fontSize: 12,
                  alignment: 'right',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ]
            ],
          },
        },
        {
          text: [
            {text: `\nLocal de entrega: `, bold: true},
            this.getAddressToDeliver(rental), 
            rental.startDate && {text: `Data de Início: `, bold: true},
            rental.startDate && this.dateFormatter.format(new Date(rental.startDate.toDateString())) + "\n",
            rental.endDate && {text: `Data de Término: `, bold: true},
            rental.endDate && this.dateFormatter.format(new Date(rental.endDate.toDateString())) + "\n",
            {text: `Período: `, bold: true},
            rental.period + " dia(s)" + "\n", 
            rental.comment && {text: `\nObservações: `, bold: true},
            rental.comment,
            "\n\n"
          ],
          fontSize: 9
        }
        ,
        this.renderClauses(),
        {
          text:DISCLAMER + "\n\n",
          bold: true,
          fontSize: 9,
        },
        {
          text: [
            "As partes elegem ",
            {
              text: "CARTÓRIO DE " + this.customer.address.city.toUpperCase() + " - RS",
              bold:true
            },
            ", para dirimir dúvidas do contrato com exclusão de qualquer outra por privilégio que seja, firmam o presente para fins de direito, em duas (2) vias de igual teor e forma, juntamente com duas testemunhas a tudo cientes.",
            "\n\n"
          ],
          fontSize: 9
        },
        {
          text: `${CITY},\ ${this.dateFormatter.format(new Date())}`,
          fontSize: 9
        },
        "\n\n",
        {
          table: {
            headerRows: 0,
            widths: ['45%', '10%' , "45%"],
            body: [
              [
                {
                  text: SIGN_FIELD + this.customer.name.toUpperCase(),
                  // fillColor: '#Dbcfed',
                  border: [false, true, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true,
                  alignment: 'center',
                },
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: ' ',
                  border: [false, true, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  alignment: 'center',
                },
              ],
              // line 2
              [
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: ' ',
                  border: [false, false, false, false],
                  alignment: 'left',
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                },
              ],
              [
                {
                  text: "Nome por Extenso",
                  // fillColor: '#Dbcfed',
                  border: [false, true, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true,
                  alignment: 'center',
                },
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: 'ASSINATURA LOCADORA: GMA - COMERCIO DE MAQUINAS LTDA\N\N',
                  border: [false, true, false, false],
                  alignment: 'center',
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                },
              ],
              [
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: ' ',
                  border: [false, false, false, false],
                  alignment: 'left',
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                },
              ],
              [
                {
                  text: "CPF",
                  // fillColor: '#Dbcfed',
                  border: [false, true, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: 'Testemunha',
                  border: [false, true, false, false],
                  alignment: 'center',
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                },
              ],
              [
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: ' ',
                  border: [false, false, false, false],
                  alignment: 'left',
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                },
              ],
              [
                {
                  text: "RG",
                  // fillColor: '#Dbcfed',
                  border: [false, true, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: " ",
                  // fillColor: '#Dbcfed',
                  border: [false, false, false, false],
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                  bold: true
                },
                {
                  text: 'RG',
                  border: [false, true, false, false],
                  alignment: 'center',
                  // margin: [0, 5, 0, 5],
                  fontSize: 9,
                },
              ],
            ],
          }
        },
    
      ],
      fontSize: 9,
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
        //font: 'Quicksand',
      },
    };
  }

  getAddressToDeliver(rental: Rental) {
    if (rental.addressToDeliver === null || rental.addressToDeliver === "") {
      return `${this.customer.address.street}, \ ${this.customer.address.number}, \ ${this.customer.address.neighborhood}, \ ${this.customer.address.city} - CEP: ${this.customer.address.cep}\n`;
    }
    
    return rental.addressToDeliver + "\n";
  }

  getContractFromStockItem(itemRental: ItemRental) {
    return [
      {
        text: itemRental.stockItem.code,
        border: [false, false, false, true],
        margin: [0, 5, 0, 5],
        fontSize: 10,
        alignment: 'left',
      },
      {
        text: itemRental.stockItem.name,
        border: [false, false, false, true],
        margin: [0, 5, 0, 5],
        fontSize: 10,
        alignment: 'left',
      },
      {
        border: [false, false, false, true],
        text: this.formatter.format(itemRental.value),
        fillColor: '#f5f5f5',
        fontSize: 10,
        alignment: 'right',
        margin: [0, 5, 0, 5],
      },
    ];
  }

}
