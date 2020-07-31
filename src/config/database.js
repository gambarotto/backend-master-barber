module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'naReguaApp',
  define: {
    timestamps: true, // Faz com que todas as tabelas do banco tenham creatAt,updateAt
    underscored: true, // Faz com q o sequelize padronize as tabelas, ex nova_tabela
    underscoredAll: true,
    // freezeTableName: true, // Cancela a pluralização automatica do sequelize
  },
};
