import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

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

    const helpOrder = await HelpOrder.findByPk(id, {
      attributes: ['id', 'question', 'answer', 'answer_at', 'created_at'],
      include: [
        {
          model: Student,
          attributes: ['name', 'email']
        }
      ]
    });

    helpOrder.answer = answer;
    helpOrder.answer_at = new Date();
    await helpOrder.save();

    await Queue.add(AnswerMail.key, {
      helpOrder
    });

    return res.json(helpOrder);
  }
}

export default new AnswerController();
