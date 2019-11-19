import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    const checkStudent = await Student.findByPk(student_id);

    if (!checkStudent) {
      return res.status(422).json({ error: 'Student does not existis' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id },
      attributes: ['created_at'],
      order: [['created_at', 'DESC']]
    });

    return res.json(checkins);
  }

  async store(req, res) {
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
