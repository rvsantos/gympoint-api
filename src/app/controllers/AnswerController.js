import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class AnswerController {
  async store(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const schema = Yup.object().shape({
      answer: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ errors: 'Validation fails' });
    }

    const helpOrder = await HelpOrder.findByPk(id);
    helpOrder.answer = answer;
    helpOrder.answer_at = new Date();
    await helpOrder.save();

    return res.json(helpOrder);
  }
}

export default new AnswerController();
