import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { student, plan, start_date, end_date, price } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula Confirmada',
      template: 'enrollment',
      context: {
        student: student.name,
        plan,
        start_date: format(parseISO(start_date), "'dia' dd 'de' MMMM'", {
          locale: pt,
        }),
        end_date: format(parseISO(end_date), "'dia' dd 'de' MMMM'", {
          locale: pt,
        }),
        price,
      },
    });
  }
}

export default new EnrollmentMail();
