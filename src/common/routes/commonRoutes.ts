import { Router } from 'express';
import container from '../../dependencyManager/inversify.config';
import TYPES from '../../dependencyManager/types';
import CommonController from '../controllers/commonController';

const router = Router();
const commonController = container.get<CommonController>(
  TYPES.CommonController,
);

router.get('/list-archive-filter', (req, res) =>
  commonController.getArchiveFilterlist(req, res),
);
router.post('/common_status_list', (req, res, next) =>
  commonController.getStatusList(req, res, next),
);
router.get('/list-fluent-languages', (req, res) =>
  commonController.getFluentLanguages(req, res),
);
router.get('/address-types', (req, res) =>
  commonController.getAddressTypes(req, res),
);
router.get('/profile_status_list', (req, res, next) =>
  commonController.getProfileStatusList(req, res, next),
);
router.get('/states', (req, res) => commonController.getState(req, res));

router.get('/city', (req, res, next) =>
  commonController.getCity(req, res, next),
);
router.get('/country', (req, res, next) =>
  commonController.getCountry(req, res, next),
);
router.get('/internationalPrefix', (req, res, next) =>
  commonController.getInternationalPrefix(req, res, next),
);

router.get('/phoneType', (req, res, next) =>
  commonController.getPhoneType(req, res, next),
);

router.get('/vendor_type', (req, res, next) =>
  commonController.getVendorType(req, res, next),
);

router.get('/contact_type', (req, res, next) =>
  commonController.getContactType(req, res, next),
);

router.get('/vendor_status_list', (req, res, next) =>
  commonController.getVendorStatusList(req, res, next),
);
export default router;
