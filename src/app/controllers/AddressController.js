import Address from '../models/Address';
import Store from '../models/Store';

class AddressController {
  async store(req, res) {
    const store = await Store.findByPk(req.params.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const address = await Address.create(req.body);
    if (!address) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    store.address_id = address.id;
    await store.save();
    return res.json(address);
  }
}

export default new AddressController();
