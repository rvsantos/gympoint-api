import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
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
