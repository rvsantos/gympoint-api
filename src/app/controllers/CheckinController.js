import * as Yup from 'yup';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    // const schema = Yup.object().shape({
    //   student_id: Yup.number().positive()
    // });

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ errors: 'Validation fails' });
    // }

    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(422).json({ error: 'Student does not found' });
    }

    const studentCheckin = await Checkin.create({
      student_id
    });

    return res.json(studentCheckin);
  }
}

export default new CheckinController();
