module.exports.models = {
   migrate: 'drop',
   attributes: {
      id: { type: 'number', autoIncrement: true, },
      createdAt: { type: 'number', autoCreatedAt: true, },
      updatedAt: { type: 'number', autoUpdatedAt: true, }
    },
    
};