import express from 'express';
import config from 'config';

const ExpressjsOptions = { limit: config.get<string>('sizeRequestLimit') };

export default express.json(ExpressjsOptions);
