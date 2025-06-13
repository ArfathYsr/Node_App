const LIBS = {
  AuthHandler: Symbol.for('AuthHandler'),
  Logger: Symbol.for('Logger'),
  PrismaClient: Symbol.for('PrismaClient'),
  HttpIntegrationConnector: Symbol.for('HttpIntegrationConnector'),
  S3Service: Symbol.for('S3Service'),
  DateService: Symbol.for('DateService'),
  StringTransformService: Symbol.for('StringTransformService'),
  HistoryService: Symbol.for('HistoryService'),
  CronService: Symbol.for('CronService'),
};

export default LIBS;
