import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, title, end_date, priceTotal } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Cadastro efetuado',
      template: 'registration',
      context: {
        plan: title,
        end_date: format(parseISO(end_date), 'dd/MM/yyyy', {
          locale: pt
        }),
        price: `R$ ${priceTotal}`
      }
    });
  }
}

export default new RegistrationMail();
