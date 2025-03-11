import Profile from '@models/profile'
import Job from '@models/job';
import Contract from '@models/contract';


Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'});
Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'});

Contract.belongsTo(Profile, {as: 'Contractor'});
Contract.belongsTo(Profile, {as: 'Client'});

Contract.hasMany(Job);
Job.belongsTo(Contract);

export { Profile, Contract, Job };
