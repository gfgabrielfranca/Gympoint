import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class AnswerOrderController {
  async index(req, res) {
    const helpOrder = await HelpOrder.findAll({
      where: { answer_at: null },
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      help_order_id: Yup.number()
        .positive()
        .required(),
      answer: Yup.string().required(),
    });

    if (
      !(await schema.isValid({ ...req.body, help_order_id: req.params.id }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    let helpOrder = await HelpOrder.findByPk(req.params.id);

    if (!helpOrder) {
      return res.status(404).json({ error: 'Help order does not exists.' });
    }

    const { answer } = req.body;

    helpOrder = await helpOrder.update({
      answer_at: new Date(),
      answer,
    });

    return res.json(helpOrder);
  }
}

export default new AnswerOrderController();
