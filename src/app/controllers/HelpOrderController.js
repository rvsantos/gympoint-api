import * as Yup from 'yup';
import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer: null },
      order: [['updated_at', 'DESC']]
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.json(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;

    const question = await HelpOrder.create({
      student_id,
      ...req.body
    });

    return res.json(question);
  }
}

export default new HelpOrderController();
