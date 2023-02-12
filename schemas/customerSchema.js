import joi from 'joi';

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().max(11).min(10).required(),
    cpf: joi.string().max(11).min(11).required(),
    birthday: joi.date().required(),
})
