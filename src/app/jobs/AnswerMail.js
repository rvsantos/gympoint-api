import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const {
      question,
      answer,
      Student: { name, email }
    } = data.helpOrder;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: `RE: ${question}`,
      template: 'answer',
      context: {
        question,
        answer
      }
    });
  }
}

export default new AnswerMail();
