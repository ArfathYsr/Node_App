import { Router } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import LookupDataController from '../controllers/lookupDataController';
import {
  QuestionListRequestSchema,
  ShortQuestionCategoryListRequestSchema,
} from '../schemas/lookupDataSchema';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

const router = Router();
const lookupDataController = container.get<LookupDataController>(
  TYPES.LookupDataController,
);
router.get('/degree', (req, res, next) =>
  lookupDataController.getDegreeList(req, res, next),
);

router.get('/specialty', (req, res, next) =>
  lookupDataController.getSpecialtyList(req, res, next),
);

router.get('/medical-license-state', (req, res, next) =>
  lookupDataController.getMedicalLicenseStateList(req, res, next),
);

router.get('/medical-license-type', (req, res, next) =>
  lookupDataController.getMedicalLicenseTypeList(req, res, next),
);

router.get('/medical-license-jurisdictions', (req, res, next) =>
  lookupDataController.getMedicalLicenseJurisdictionsList(req, res, next),
);
router.get('/segmentation', (req, res, next) =>
  lookupDataController.getSegmentationList(req, res, next),
);
router.get('/affiliation-type', (req, res, next) =>
  lookupDataController.getAffiliationTypeList(req, res, next),
);
router.get('/medical-license-status', (req, res, next) =>
  lookupDataController.getMedicalLicenseStatusList(req, res, next),
);

router.get(
  '/questions/:categoryId',
  validatorMiddleware(QuestionListRequestSchema),
  (req, res, next) => lookupDataController.getQuestionList(req, res, next),
);

router.post(
  '/questioncategory/list/short',
  validatorMiddleware(ShortQuestionCategoryListRequestSchema),
  (req, res, next) =>
    lookupDataController.getShortQuestionCategoryList(req, res, next),
);

router.get('/work-items', (req, res, next) =>
  lookupDataController.getWorkItemsList(req, res, next),
);
export default router;
