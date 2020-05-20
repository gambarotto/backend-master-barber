import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          // Verifica se o horário atual é depois do horário marcado
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          // Verifica se o cancelamento é feito com 2 horas de antecedencia
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });
    this.belongsTo(models.Store, {
      foreignKey: 'store_id',
      as: 'store',
    });
    this.belongsTo(models.Custumer, {
      foreignKey: 'custumer_id',
      as: 'custumer',
    });
  }
}
export default Appointment;
