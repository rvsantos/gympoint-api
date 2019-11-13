import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price']
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

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const plan = await Plan.findByPk(id);
    const { title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    plan.destroy();

    return res.send();
  }
}

export default new PlanController();
