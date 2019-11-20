import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { student_id } = req.params;

    const checkStudent = await Student.findByPk(student_id);

    if (!checkStudent && student_id !== undefined) {
      return res.status(422).json({ errors: 'Student does not exists.' });
    }

    const optinalWhere =
      student_id === undefined ? { answer: null } : { student_id };

    const helpOrders = await HelpOrder.findAll({
      where: optinalWhere,
      order: [['updated_at', 'DESC']],
      attributes: [
        'id',
        'student_id',
        'question',
        'answer',
        'answer_at',
        'created_at'
      ]
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
