// src/shared/utils/paginate.js

/**
 * Função genérica para paginar e filtrar consultas no Mongoose.
 * @param {Object} model O modelo do Mongoose (ex: Transaction, Goal).
 * @param {Object} baseQuery A query base para a busca (ex: { user: userId }).
 * @param {Object} filters Os filtros de paginação e outros filtros da requisição (ex: req.query).
 * @param {Object} options Opções de ordenação e outros (ex: { sort: { date: -1 } }).
 * @returns {Promise<Object>} Um objeto com os documentos paginados e os metadados.
 */
const paginate = async (model, baseQuery, filters = {}, options = {}) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  // Clona a query base para não a modificar diretamente
  const query = { ...baseQuery };

  // Adiciona filtros dinamicamente
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date.$lt = endDate;
    }
  }

  // Você pode adicionar mais filtros genéricos aqui, se for necessário
  if (filters.type) {
    query.type = filters.type;
  }
  if (filters.category) {
    query.category = { $regex: new RegExp(filters.category, 'i') };
  }
  
  if (filters.frequency) {
    query.frequency = filters.frequency
  }
  
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive
  }

  // 1. Obter o total de documentos que correspondem aos filtros
  const totalDocs = await model.countDocuments(query);

  // 2. Obter os documentos da página atual
  const docs = await model.find(query)
    .sort(options.sort || { createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    docs,
    totalDocs,
    totalPages: Math.ceil(totalDocs / limit),
    currentPage: page,
    limit,
  };
};

export default paginate;
