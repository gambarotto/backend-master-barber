import Service from '../models/Service';
import User from '../models/User';

class ServiceController {
  async index(req, res) {
    const services = await Service.findAll({
      where: {
        store_id: req.query.store,
      },
      attributes: ['id', 'name', 'price'],
    });
    return res.json(services);
  }

  async store(req, res) {
    const service = await Service.create(req.body);
    const user = await User.findByPk(req.userId);
    if (user.store_id !== req.body.store_id) {
      return res
        .status(404)
        .json({ error: 'you cannot create a different store service' });
    }
    return res.json(service);
  }

  async update(req, res) {
    const service = await Service.findByPk(req.params.service_id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    const user = await User.findByPk(req.userId);

    if (user.store_id !== req.body.store_id) {
      return res
        .status(404)
        .json({ error: 'you cannot add a different store service' });
    }
    service.update(req.body);
    return res.json(service);
  }

  async delete(req, res) {
    const service = await Service.findByPk(req.params.service_id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    const user = await User.findByPk(req.userId);
    if (user.store_id !== req.body.store_id) {
      return res
        .status(404)
        .json({ error: 'you cannot delete a different store service' });
    }
    await service.destroy();
    return res.json({ success: 'Serviço excluído com Sucesso!' });
  }
}

export default new ServiceController();
