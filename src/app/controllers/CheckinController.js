import * as Yup from 'yup';
import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll(
      { where: { student_id: req.params.id } },
      {
        include: [
          {
            model: Student,
            as: 'student',
          },
        ],
      }
    );

    return res.json(checkins);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(401).json({ error: 'Student does not exists.' });
    }

    const { count } = await Checkin.findAndCountAll({
      where: {
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
        student_id: req.params.id,
      },
    });

    if (count > 5) {
      return res.status(401).json({
        error: 'You have exceeded the amount of allowed checkins.',
      });
    }

    const checkin = await Checkin.create({ student_id: req.params.id });

    return res.json(checkin);
  }
}

export default new CheckinController();
