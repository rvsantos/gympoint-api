import * as Yup from 'yup';
import { addMonths, parseISO, isBefore } from 'date-fns';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Registration from '../models/Registration';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          attributes: ['name', 'age', 'email']
        },
        {
          model: Plan,
          attributes: ['title', 'duration', 'price']
        }
      ]
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, student_id, plan_id } = req.body;

    // Verify if date is before now
    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(401).json({ error: 'Invalid date' });
    }

    // Check if student exists
    const checkStudentExists = await Student.findByPk(student_id);

    if (!checkStudentExists) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    // Check if plan exists
    const checkPlanExists = await Plan.findByPk(plan_id);

    if (!checkPlanExists) {
      return res.status(401).json({ error: 'Plan does not exists' });
    }

    // Check if student already registered
    const checkRegisterStudent = await Registration.findOne({
      where: { student_id }
    });

    if (checkRegisterStudent) {
      return res.status(401).json({ error: 'Student already registered' });
    }

    const { price, duration } = checkPlanExists;
    const priceTotal = price * duration;

    const end_date = addMonths(parseISO(start_date), duration);

    const registration = await Registration.create({
      start_date,
      end_date,
      price: priceTotal,
      student_id,
      plan_id
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
