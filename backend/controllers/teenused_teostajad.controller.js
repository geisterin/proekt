const { TeenusedTeostajad, Tootaja } = require('../models');

exports.getByServiceList = async (req, res) => {
  try {
    const { teenused_list_id } = req.params;

    const results = await TeenusedTeostajad.findAll({
      where: { teenused_list_id },
      include: { model: Tootaja, foreignKey: 'tootaja_id' }
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch executors', error: err.message });
  }
};

exports.addExecutor = async (req, res) => {
  try {
    const { teenused_list_id, tootaja_id, teostamise_kuupaev, kommentaar } = req.body;

    const teostaja = await TeenusedTeostajad.create({
      teenused_list_id,
      tootaja_id,
      teostamise_kuupaev,
      kommentaar
    });

    res.status(201).json({ message: 'Executor added', teostaja });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add executor', error: err.message });
  }
};

// Обновить комментарий и дату выполнения
exports.updateExecution = async (req, res) => {
  try {
    const { id } = req.params;
    const { kommentaar } = req.body;

    const record = await TeenusedTeostajad.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Исполнитель не найден' });

    // Проверка доступа: может менять только тот, кто назначен
    if (req.user.tootaja_id !== record.tootaja_id && req.user.roll !== 'Manager') {
      return res.status(403).json({ message: 'Нет доступа для редактирования' });
    }

    // Обновляем комментарий и дату
    record.kommentaar = kommentaar;
    record.teostamise_kuupaev = new Date();
    await record.save();

    res.json({ message: 'Комментарий обновлён', record });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления', error: err.message });
  }
};
