const { Toode, Brand, ToodeHinnad, sequelize } = require('../models'); 

exports.getOne = async (req, res) => {
  try {
    const toode = await Toode.findByPk(req.params.id, {
      include: [
        { model: Brand },
        {
          model: ToodeHinnad,
          limit: 1,
          order: [['kuupaev', 'DESC']],
          as: 'hinnad'  // убедитесь в алиасе, если используете hasMany
        }
      ]
    });

    if (!toode) return res.status(404).json({ message: 'Product not found' });

    const lastHind = toode.hinnad?.[0];
    res.json({
      ...toode.toJSON(),
      hind: lastHind?.hind || null,
      hind_kuupaev: lastHind?.kuupaev || null
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};


exports.create = async (req, res) => {
  console.log('🚀 Получено от клиента:', req.body);
  const t = await sequelize.transaction();
  try {
    const { hind, kuupaev, ...toodeData } = req.body;

    if (!toodeData.toode_pilt) {
      console.warn('⚠️ Картинка не передана!');
    }

    const newToode = await Toode.create(toodeData, { transaction: t });

    if (hind && kuupaev) {
      await ToodeHinnad.create({
        toode_id: newToode.toode_id,
        hind,
        kuupaev
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Product created', toode: newToode });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};
// Все товары 

exports.getAllTooted = async (req, res) => {
  try {
    const tooted = await Toode.findAll({
      include: [
        { model: Brand, foreignKey: 'brand_id' },
        {
          model: ToodeHinnad,
          as: 'hinnad',
          limit: 1,
          order: [['kuupaev', 'DESC']]
        }
      ]
    });

    // Формируем массив с последней ценой
    const result = tooted.map(toode => {
      const lastHind = toode.hinnad?.[0];
      return {
        toode_id: toode.toode_id,
        nimetus: toode.nimetus,
        kirjeldus: toode.kirjeldus,
        standart_suurus: toode.standart_suurus,
        toode_pilt: toode.toode_pilt,
        tuup: toode.tuup,
        brand_id: toode.brand_id,
        hind: lastHind?.hind ? parseFloat(lastHind.hind) : null
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении товаров', error: err.message });
  }
};


// Обновление товара

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { hind, kuupaev, ...toodeData } = req.body;

    const toode = await Toode.findByPk(id);
    if (!toode) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Обновляем только данные о товаре
    await toode.update(toodeData);

    // Если в теле есть новая цена — добавляем запись в toode_hinnad
    if (hind !== undefined) {
      await ToodeHinnad.create({
        toode_id: id,
        hind,
        kuupaev: kuupaev || new Date()  // если дата не указана — берется текущая
      });
    }

    res.json({
      message: 'Product updated successfully',
      toode
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};


// удалить товары
exports.delete = async (req, res) => {
  try {
    const toodeId = req.params.id;
    const deleted = await Toode.destroy({ where: { toode_id: toodeId } });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};
