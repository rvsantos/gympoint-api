import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['title', 'duration', 'price']
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, duration, price } = req.body;

    const checkPlanExists = await Plan.findOne({ where: { title } });

    if (checkPlanExists) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const plan = await Plan.create({
      title,
      duration,
      price
    });

    return res.json(plan);
  }
}

export default new PlanController();
