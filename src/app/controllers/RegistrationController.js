import * as Yup from 'yup';
import { addMonths, parseISO, isBefore } from 'date-fns';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Registration from '../models/Registration';

class RegistrationController {
  async index(req, res) {
    const status = !req.params.inactive ? 'active' : 'inactive';

    const registrations = await Registration.findAll({
      where: { status },
      attributes: [
        'id',
        'start_date',
        'end_date',
        'price',
        'status',
        'canceled_at'
      ],
      order: [['id', 'desc']],
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'age', 'email']
        },
        {
          model: Plan,
          attributes: ['id', 'title', 'duration', 'price']
        }
      ]
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number()
        .required()
        .positive(),
      plan_id: Yup.number()
        .required()
        .positive()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, student_id, plan_id } = req.body;
    const checkStudentExists = await Student.findByPk(student_id);
    const checkPlanExists = await Plan.findByPk(plan_id);

    // Verify if date is before now
    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(401).json({ error: 'Invalid date' });
    }

    // Check if student exists
    if (!checkPlanExists || !checkStudentExists) {
      return res.status(401).json({ error: 'Plan/Student does not exists' });
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

  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      student_id: Yup.number().positive(),
      plan_id: Yup.number().positive()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, student_id, plan_id } = req.body;

    const registration = await Registration.findOne({
      where: { student_id: id }
    });

    if (!registration) {
      return res.status(401).json({ error: 'Unregistered student' });
    }

    if (student_id && registration.student_id !== student_id) {
      return res.status(400).json({ error: 'Cannot change student_id' });
    }

    if (plan_id && plan_id !== registration.plan_id) {
      const checkPlanExists = await Plan.findByPk(plan_id);
      if (!checkPlanExists) {
        return res.status(400).json({ error: 'Plan does not exists' });
      }
    }

    if (start_date && start_date !== registration.start_date) {
      if (isBefore(parseISO(start_date), new Date())) {
        return res.status(400).json({ error: 'Invalid date' });
      }
    }

    const { duration, price } = await Plan.findByPk(plan_id);
    const priceTotal = price * duration;
    const end_date = addMonths(parseISO(start_date), duration);

    const { id: registrationId } = registration.update({
      ...req.body,
      price: priceTotal,
      end_date
    });

    return res.json({
      registrationId,
      student_id,
      plan_id,
      start_date,
      end_date
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const registration = await Registration.findOne({
      where: { student_id: id },
      attributes: ['id', 'start_date', 'end_date', 'price', 'status'],
      order: [['canceled_at', 'desc']],
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'age', 'email']
        },
        {
          model: Plan,
          attributes: ['id', 'title', 'duration', 'price']
        }
      ]
    });

    if (!registration) {
      return res.status(401).json({ error: 'Unregistered student' });
    }

    registration.canceled_at = new Date();
    registration.status = 'inactive';

    await registration.save();

    return res.json(registration);
  }
}

export default new RegistrationController();
